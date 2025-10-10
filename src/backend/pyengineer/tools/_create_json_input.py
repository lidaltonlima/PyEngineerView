"""Create JSON results file for calculated structure"""
import json

from pyengineer.objects._load import INodalLoadData
from pyengineer.objects._support import ISupportSupports

from ..analysis._linear import Linear
from ..objects import Material, Section


def create_json_input(path: str, analysis: Linear) -> None:
    """Create a JSON results file for the linear analysis.

    Args:
        path (str): The path to the JSON file to create.
        analysis (Linear): The linear analysis object containing results.
    """
    structure = {}

    # Materials and Sections //////////////////////////////////////////////////////////////////////
    # Get materials and sections from bars
    materials: list[Material]  = []
    sections: list[Section] = []
    for bar in analysis.bars:
        if bar.material not in materials:
            materials.append(bar.material)
        if bar.section not in sections:
            sections.append(bar.section)

    # Materials ***********************************************************************************
    material_dict: list[dict[str, str | dict[str, float]]] = []
    for material in materials:
        material_dict.append({
            'name': material.name,
            'properties': {
                'E': material.properties['E'],
                'G': material.properties['G'],
                'nu': material.properties['nu'],
                'rho': material.properties['rho']
            }
        })
    structure['materials'] = material_dict

    # Sections ************************************************************************************
    sections_dict: list[dict[str, str | float | dict[str, float]]] = []
    for section in sections:
        sections_dict.append({
            'name': section.name,
            'area': section.properties['area'],
            'inertias': {
                'Ix': section.properties['Ix'],
                'Iy': section.properties['Iy'],
                'Iz': section.properties['Iz']
            }
        })
    structure['sections'] = sections_dict

    # Nodes ///////////////////////////////////////////////////////////////////////////////////////
    nodes_dict: list[dict[str, str | list[float]]] = []
    for node in analysis.nodes:
        nodes_dict.append({
            'name': node.name,
            'position': [node.position[0], node.position[1], node.position[2]]
        })
    structure['nodes'] = nodes_dict

    # Bars ////////////////////////////////////////////////////////////////////////////////////////
    bars_dict: list[dict[str, str | float | list[str]]] = []
    for bar in analysis.bars:
        releases: list[str] = []
        for key, value in bar.releases.items():
            if value:
                releases.append(key)
        bars_dict.append({
            'name': bar.name,
            'start_node': bar.start_node.name,
            'end_node': bar.end_node.name,
            'section': bar.section.name,
            'material': bar.material.name,
            'rotation': bar.rotation,
            'releases': releases
        })
    structure['bars'] = bars_dict

    # Supports ////////////////////////////////////////////////////////////////////////////////////
    supports_dict: list[dict[str, str | ISupportSupports]] = []
    for key, value in analysis.supports.nodes_support.items():
        supports_dict.append({
            'node': key.name,
            'supports': value
        })
    structure['supports'] = supports_dict

    # Loads ///////////////////////////////////////////////////////////////////////////////////////
    loads_dict: list[dict[str,
                          str |
                          list[dict[str,
                                    str | INodalLoadData]] |
                          dict[str,
                               list[dict[str, str | float | dict[str, float]]] |
                               list[dict[str, str | list[float] | dict[str, list[float]]]]]
                          ]] = []
    for load in analysis.loads:
        # Nodal Loads *****************************************************************************
        node_load_dict: list[dict[str, str | INodalLoadData]] = []
        for node in load.nodes_loads:
            for name, node_load in load.nodes_loads[node].items():
                node_load_dict.append({
                    'name': name,
                    'node': node.name,
                    'loads': node_load
                })

        # Bar Loads *******************************************************************************
        # Point loads -----------------------------------------------------------------------------
        bar_load_pt_dict: list[dict[str, str | float | dict[str, float]]] = []
        for bar in load.bars_loads_pt:
            for name, bar_load in load.bars_loads_pt[bar].items():
                bar_load_pt_dict.append({
                    'name': name,
                    'bar': bar.name,
                    'system': bar_load['system'],
                    'position': bar_load['position'],
                    'loads': {
                        'Fx': bar_load['Fx'],
                        'Fy': bar_load['Fy'],
                        'Fz': bar_load['Fz'],
                        'Mx': bar_load['Mx'],
                        'My': bar_load['My'],
                        'Mz': bar_load['Mz']
                    }
                })
        # Distributed loads -----------------------------------------------------------------------
        bar_load_dist_dict: list[dict[str, str | list[float] | dict[str, list[float]]]] = []
        for bar in load.bars_loads_dist:
            for name, bar_load in load.bars_loads_dist[bar].items():
                bar_load_dist_dict.append({
                    'name': name,
                    'bar': bar.name,
                    'system': bar_load['system'],
                    'position': [bar_load['x1'], bar_load['x2']],
                    'loads': {
                        'Fx': [bar_load['Fx'][0], bar_load['Fx'][1]],
                        'Fy': [bar_load['Fy'][0], bar_load['Fy'][1]],
                        'Fz': [bar_load['Fz'][0], bar_load['Fz'][1]],
                        'Mx': [bar_load['Mx'][0], bar_load['Mx'][1]],
                        'My': [bar_load['My'][0], bar_load['My'][1]],
                        'Mz': [bar_load['Mz'][0], bar_load['Mz'][1]]
                    }
                })

        # Append bar loads to the loads dictionary ************************************************
        loads_dict.append({
            'name': load.name,
            'nodes': node_load_dict,
            'bars': {
                'point': bar_load_pt_dict,
                'distributed': bar_load_dist_dict
            }
        })
    structure['loads'] = loads_dict

    # Write results to JSON file //////////////////////////////////////////////////////////////////
    with open(path, 'w', encoding='utf-8') as file:
        json.dump(structure, file, indent=2)
