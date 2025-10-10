"""Faz a análise linear da estrutura"""
import numpy as np
from numpy.typing import NDArray
from numpy import float64

from ..objects import Node
from ..objects import Bar
from ..objects import Load
from ..objects import Support

from ..utils import is_number


class Linear:
    """Análise linear"""
    def __init__(self, nodes: list[Node], bars: list[Bar],
                 loads: list[Load], supports: Support, calculate: bool = True):
        """Construtor

        Args:
            nodes (list[Node]): Nós
            bars (list[Bar]): Barras
            loads (list[Load]): Casos de carga
            supports (Support): Apoios
        """
        self.nodes = nodes
        self.bars = bars
        self.loads = loads
        self.supports = supports
        self.matrix_order = 6 * len(nodes)
        self.calculated = False
        self.displacements: dict[Load, NDArray[float64]] = {}
        self.reactions: dict[Load, NDArray[float64]] = {}
        self.kg: NDArray[float64] = np.array([])
        self.kg_solution: NDArray[float64] = np.array([])
        self.forces_vector: dict[Load,  NDArray[float64] ] = {}

        if calculate:
            self.calculate_structure()

    def calculate_structure(self) -> None:
        """Realiza a calculo"""
        self.displacements = {}
        self.reactions: dict[Load, NDArray[float64]] = {}
        self.kg_solution = self.calculate_kg_solution()
        self.forces_vector = self.calculate_forces_vector()

        for load in self.loads:
            # Calculate displacements
            self.displacements[load] = np.linalg.inv(self.kg_solution) @ self.forces_vector[load]

            # Calculate reactions
            self.reactions[load] = self.kg @ self.displacements[load] - self.forces_vector[load]

        self.calculate_extremes_bars_forces()

        self.calculated = True

    def calculate_forces_vector(self) -> dict[Load, NDArray[float64]]:
        """Calcula o vetor de forças para cada caso de carga e cria um dicionário

        Returns:
            dict: Vetor de forças
        """
        forces: dict[Load, NDArray[float64]] = {}
        for load in self.loads:
            f_load = np.zeros(self.matrix_order, dtype=float)

            for node in load.nodes_loads:
                node_position = (self.nodes.index(node) + 1) * 6 - 6

                for force in load.nodes_loads[node].values():
                    index = 0
                    for key in force.keys():
                        f_load[node_position + index] += force[key]
                        index += 1

            for bar in load.bars_loads_pt:
                bar.calculate_forces_vector(load)
                spread_vector = self.calculate_spread_vector(bar)

                for i in range(12):
                    f_load[spread_vector[i]] += bar.vector_loads[i]

            for bar in load.bars_loads_dist:
                bar.calculate_forces_vector(load)
                spread_vector = self.calculate_spread_vector(bar)

                for i in range(12):
                    f_load[spread_vector[i]] += bar.vector_loads[i]

            forces[load] = f_load.copy()

        return forces

    def calculate_kg(self) -> NDArray[float64]:
        """ Calcula a matriz de rigidez global

        Returns:
            ndarray: Matriz de rigidez global
        """
        kg = np.zeros([self.matrix_order, self.matrix_order])

        for bar in self.bars:
            spread_vector = self.calculate_spread_vector(bar)
            bar.calculate_kl()
            bar.calculate_r()
            bar.klg = bar.calculate_klg()

            line_local = -1 # Índice da linha localmente
            for line_global in spread_vector:
                line_local += 1
                column_local = -1 # Índice da coluna localmente
                for column_global in spread_vector:
                    column_local += 1
                    kg[line_global][column_global] += bar.klg[line_local][column_local]

        return kg

    def calculate_kg_solution(self) -> NDArray[float64]:
        """Aplica os apoios na matriz

        Returns:
            ndarray: Matriz de rigidez com os apoios aplicados
        """
        self.kg = self.calculate_kg()
        kg_solution = self.kg.copy()

        for node in self.supports.nodes_support:
            # Índices globais de cada nó
            node_index = self.nodes.index(node)

            support_indices: list[int] = []
            spring_index = {}
            index = 0
            for support in self.supports.nodes_support[node].values():
                if support:
                    if is_number(support):
                        spring_index[6 * (node_index + 1) - (6 - index)] = support
                    support_indices.append(6 * (node_index + 1) - (6 - index))

                index += 1


            # Colocar número grande na diagonal
            for i in support_indices:
                for j in support_indices:
                    if i == j:
                        # Se tiver mola, soma apenas a mola
                        if i in spring_index:
                            kg_solution[i][j] += spring_index[i]
                        else:
                            kg_solution[i][j] += 1e25

        return kg_solution

    def calculate_spread_vector(self, bar: Bar) -> list[int]:
        """Calcula o vetor de espalhamento

        Args:
            bar (Bar): Barra

        Returns:
            list[int]: Vetor de espalhamento
        """
        # Vetor de espalhamento *******************************************************************
        ni = self.nodes.index(bar.start_node) # Índice do nó inicial
        nf = self.nodes.index(bar.end_node) # Índice do nó final

        spread_vector = [6 * (ni + 1) - 6, 6 * (ni + 1) - 5, 6 * (ni + 1) - 4,
                         6 * (ni + 1) - 3, 6 * (ni + 1) - 2, 6 * (ni + 1) - 1,
                         6 * (nf + 1) - 6, 6 * (nf + 1) - 5, 6 * (nf + 1) - 4,
                         6 * (nf + 1) - 3, 6 * (nf + 1) - 2, 6 * (nf + 1) - 1]
        return spread_vector


    def get_displacements(self, node_name: str, load_name: str) -> NDArray[float64]:
        """Pega os deslocamentos

        Args:
            node_name (str): Nome do nó
            load_name (str): Nome do caso de carga

        Returns:
            ndarray: Deslocamentos
        """
        node_displacements: NDArray[float64] = np.array([])
        for load in self.loads:
            if load.name == load_name:
                for node in self.nodes:
                    if node.name == node_name:
                        node_index = self.nodes.index(node) # Node index
                        initial_index = 6 * (node_index + 1) - 6
                        end_index = 6 * (node_index + 1)

                        node_displacements = self.displacements[load][initial_index : end_index]
                        break
                break

        return node_displacements

    def get_reactions(self, node_name: str, load_name: str) -> NDArray[float64]:
        """Pega as reações

        Args:
            node_name (str): Nome do nó
            load_name (str): Nome do caso de carga

        Returns:
            ndarray: Reações
        """
        node_reactions: NDArray[float64] = np.array([])
        for load in self.loads:
            if load.name == load_name:
                for node in self.nodes:
                    if node.name == node_name:
                        node_index = self.nodes.index(node) # Node index
                        initial_index = 6 * (node_index + 1) - 6
                        end_index = 6 * (node_index + 1)

                        node_reactions = self.reactions[load][initial_index : end_index]

                        for reaction_index, support in \
                            enumerate(self.supports.nodes_support[node].values()):
                            if not support:
                                node_reactions[reaction_index] = 0.0
                        break
                break

        return node_reactions

    def calculate_extremes_bars_forces(self):
        """Calculate extreme forces in bars
        """
        for bar in self.bars:
            for load in self.loads:
                # Get nodal displacements for this bar
                start_displacements = self.get_displacements(bar.start_node.name, load.name)
                end_displacements = self.get_displacements(bar.end_node.name, load.name)
                displacements = np.concatenate((start_displacements, end_displacements))

                # Calculate bar forces: displacement forces - equivalent nodal forces
                # The negative sign accounts for the fact that vector_loads are forces
                # applied TO the bar, while we want forces IN the bar
                displacement_forces = bar.klg @ displacements
                bar_forces = displacement_forces - bar.vector_loads

                # Transform to local coordinates and apply sign convention
                bar.extreme_forces[load.name] = (bar.r @ bar_forces) * \
                    np.array([-1,  1,  1,  1,  1, -1,
                               1, -1, -1, -1, -1,  1])
