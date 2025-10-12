"""Analysis structure in json file"""
from ..objects import Node
from ..objects import Bar
from ..objects import Material
from ..objects import Section
from ..objects import Support
from ..objects import Load
from ..analysis import Linear

from ..types import ReleasesType
from ..types.structure import IStructure

def calculate_structure_data(
    data: IStructure
    ) -> list[dict[str, str | list[dict[str, str | float]]]]:
    """Analysis structure in json file

    Args:
        path (str): path to file

    Returns:
        Linear: the result of linear analysis
    """

    # Create objects ///////////////////////////////////////////////////////////////////////////////
    # Materials ************************************************************************************
    materials: list[Material] = []
    for material in data.materials:
        materials.append(Material(material.name,
                                  material.properties.E,
                                  material.properties.G,
                                  material.properties.nu,
                                  material.properties.rho))
    # Sections *************************************************************************************
    sections: list[Section] = []
    for section in data.sections:
        sections.append(Section(section.name,
                                section.area,
                                section.inertias.Ix,
                                section.inertias.Iy,
                                section.inertias.Iz))

    # Nodes ****************************************************************************************
    nodes: list[Node] = []
    for node in data.nodes:
        nodes.append(Node(node.name, node.position))

    # Bars *****************************************************************************************
    start_node = Node('ERROR', [0, 0, 0])
    end_node = Node('ERROR', [0, 0, 0])
    section_bar = Section('ERROR', 0, 0, 0, 0)
    material_bar = Material('ERROR', 0, 0, 0, 0)
    bars: list[Bar] = []
    for index, bar in enumerate(data.bars):
        for node in nodes:
            if node.name == bar.start_node:
                start_node: Node = node
            elif node.name == bar.end_node:
                end_node: Node = node

        for section in sections:
            if section.name == bar.section:
                section_bar = section

        for material in materials:
            if material.name == bar.material:
                material_bar = material

        bars.append(Bar(bar.name,
                        start_node,
                        end_node,
                        section_bar,
                        material_bar,
                        bar.rotation))

        releases: list[ReleasesType]= bar.releases
        for release in releases:
            match release:
                case 'Dxi':
                    bars[index].releases['Dxi'] = True
                case 'Dyi':
                    bars[index].releases['Dyi'] = True
                case 'Dzi':
                    bars[index].releases['Dzi'] = True
                case 'Rxi':
                    bars[index].releases['Rxi'] = True
                case 'Ryi':
                    bars[index].releases['Ryi'] = True
                case 'Rzi':
                    bars[index].releases['Rzi'] = True
                case 'Dxj':
                    bars[index].releases['Dxj'] = True
                case 'Dyj':
                    bars[index].releases['Dyj'] = True
                case 'Dzj':
                    bars[index].releases['Dzj'] = True
                case 'Rxj':
                    bars[index].releases['Rxj'] = True
                case 'Ryj':
                    bars[index].releases['Ryj'] = True
                case 'Rzj':
                    bars[index].releases['Rzj'] = True

    # Supports *************************************************************************************
    supports = Support()
    node_support = Node('ERROR', [0, 0, 0])
    for sup in data.supports:
        for node in nodes:
            if node.name == sup.node:
                node_support = node
        supports.add_support(node_support,
                            sup.supports.Dx,
                            sup.supports.Dy,
                            sup.supports.Dz,
                            sup.supports.Rx,
                            sup.supports.Ry,
                            sup.supports.Rz)

    # Loads ***************************************************************************************
    loads: list[Load] = []
    for index, load in enumerate(data.loads):
        loads.append(Load(load.name))

        for node in nodes:
            for node_data in load.nodes:
                if node.name == node_data.node:
                    loads[index].add_node_load(node_data.name,
                                               node,
                                               node_data.loads.Fx,
                                               node_data.loads.Fy,
                                               node_data.loads.Fz,
                                               node_data.loads.Mx,
                                               node_data.loads.My,
                                               node_data.loads.Mz)
        for bar in bars:
            for point_data in load.bars.point:
                if bar.name == point_data.bar:
                    loads[index].add_bar_load_pt(point_data.name,
                                                 bar,
                                                 point_data.position,
                                                 point_data.system,
                                                 point_data.loads.Fx,
                                                 point_data.loads.Fy,
                                                 point_data.loads.Fz,
                                                 point_data.loads.Mx,
                                                 point_data.loads.My,
                                                 point_data.loads.Mz)
            for dist_load in load.bars.distributed:
                if bar.name == dist_load.bar:
                    loads[index].add_bar_load_dist(dist_load.name,
                                                   bar,
                                                   dist_load.position[0],
                                                   dist_load.position[1],
                                                   dist_load.system,
                                                   dist_load.loads.Fx,
                                                   dist_load.loads.Fy,
                                                   dist_load.loads.Fz,
                                                   dist_load.loads.Mx,
                                                   dist_load.loads.My,
                                                   dist_load.loads.Mz)


    # Analysis and return /////////////////////////////////////////////////////////////////////////
    analysis = Linear(nodes, bars, loads, supports)
    results: list[dict[str, str | list[dict[str, str | float]]]] = []

    # Create dictionary structure for results *****************************************************
    for index_load, load in enumerate(analysis.loads):
        results.append({'load_case': load.name})
        # Get displacements for each node under the current load case -----------------------------
        displacements: list[dict[str, str | float]] = []
        for node in analysis.nodes:
            disp_vector = analysis.get_displacements(node.name, load.name)
            displacements.append({'node': node.name,
                                         'Dx': disp_vector[0],
                                         'Dy': disp_vector[1],
                                         'Dz': disp_vector[2],
                                         'Rx': disp_vector[3],
                                         'Ry': disp_vector[4],
                                         'Rz': disp_vector[5]})
        results[index_load]['displacements'] = displacements

        # Get reactions for each support under the current load case -----------------------------
        reactions: list[dict[str, str | float]] = []
        for node in analysis.supports.nodes_support.keys():
            reactions_vector = analysis.get_reactions(node.name, load.name)
            reactions.append({'node': node.name,
                              'Fx': reactions_vector[0],
                              'Fy': reactions_vector[1],
                              'Fz': reactions_vector[2],
                              'Mx': reactions_vector[3],
                              'My': reactions_vector[4],
                              'Mz': reactions_vector[5]})
        results[index_load]['reactions'] = reactions

        # Get extreme forces for each bar under the current load case -----------------------------
        extreme_forces: list[dict[str, str | float]] = []
        for bar in analysis.bars:
            forces_vector = bar.extreme_forces[load.name]
            extreme_forces.append({'bar': bar.name,
                                   'Fxi': forces_vector[0],
                                   'Fyi': forces_vector[1],
                                   'Fzi': forces_vector[2],
                                   'Mxi': forces_vector[3],
                                   'Myi': forces_vector[4],
                                   'Mzi': forces_vector[5],
                                   'Fxj': forces_vector[6],
                                   'Fyj': forces_vector[7],
                                   'Fzj': forces_vector[8],
                                   'Mxj': forces_vector[9],
                                   'Myj': forces_vector[10],
                                   'Mzj': forces_vector[11]})
        results[index_load]['extreme_forces'] = extreme_forces
    return results
