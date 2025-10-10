"""Analysis structure in json file"""
import json

from ..objects import Node
from ..objects import Bar
from ..objects import Material
from ..objects import Section
from ..objects import Support
from ..objects import Load
from ..analysis import Linear

from ..types import ReleasesType

def calculate_json(path: str) -> Linear:
    """Analysis structure in json file

    Args:
        path (str): path to file

    Returns:
        Linear: the result of linear analysis
    """
    with open(path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Create objects ///////////////////////////////////////////////////////////////////////////////
    # Materials ************************************************************************************
    materials: list[Material] = []
    for material in data['materials']:
        materials.append(Material(material['name'],
                                  material['properties']['E'],
                                  material['properties']['G'],
                                  material['properties']['nu'],
                                  material['properties']['rho']))
    # Sections *************************************************************************************
    sections: list[Section] = []
    for section in data['sections']:
        sections.append(Section(section['name'],
                                section['area'],
                                section['inertias']['Ix'],
                                section['inertias']['Iy'],
                                section['inertias']['Iz']))

    # Nodes ****************************************************************************************
    nodes: list[Node] = []
    for node in data['nodes']:
        nodes.append(Node(node['name'], node['position']))

    # Bars *****************************************************************************************
    start_node = Node('ERROR', [0, 0, 0])
    end_node = Node('ERROR', [0, 0, 0])
    section_bar = Section('ERROR', 0, 0, 0, 0)
    material_bar = Material('ERROR', 0, 0, 0, 0)
    bars: list[Bar] = []
    for index, bar in enumerate(data['bars']):
        for node in nodes:
            if node.name == bar['start_node']:
                start_node: Node = node
            elif node.name == bar['end_node']:
                end_node: Node = node

        for section in sections:
            if section.name == bar['section']:
                section_bar = section

        for material in materials:
            if material.name == bar['material']:
                material_bar = material

        bars.append(Bar(bar['name'],
                        start_node,
                        end_node,
                        section_bar,
                        material_bar,
                        bar['rotation']))

        releases: list[ReleasesType]= bar['releases']
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
    for sup in data['supports']:
        for node in nodes:
            if node.name == sup['node']:
                node_support = node
        supports.add_support(node_support,
                            sup['supports']['Dx'],
                            sup['supports']['Dy'],
                            sup['supports']['Dz'],
                            sup['supports']['Rx'],
                            sup['supports']['Ry'],
                            sup['supports']['Rz'])

    # Loads ***************************************************************************************
    loads: list[Load] = []
    for index, load in enumerate(data['loads']):
        loads.append(Load(load['name']))

        for node in nodes:
            for node_data in load['nodes']:
                if node.name == node_data['node']:
                    loads[index].add_node_load(node_data['name'],
                                               node,
                                               node_data['loads']['Fx'],
                                               node_data['loads']['Fy'],
                                               node_data['loads']['Fz'],
                                               node_data['loads']['Mx'],
                                               node_data['loads']['My'],
                                               node_data['loads']['Mz'])
        for bar in bars:
            for point_data in load['bars']['point']:
                if bar.name == point_data['bar']:
                    loads[index].add_bar_load_pt(point_data['name'],
                                                 bar,
                                                 point_data['position'],
                                                 point_data['system'],
                                                 point_data['loads']['Fx'],
                                                 point_data['loads']['Fy'],
                                                 point_data['loads']['Fz'],
                                                 point_data['loads']['Mx'],
                                                 point_data['loads']['My'],
                                                 point_data['loads']['Mz'])
            for dist_data in load['bars']['distributed']:
                if bar.name == dist_data['bar']:
                    loads[index].add_bar_load_dist(dist_data['name'],
                                                   bar,
                                                   dist_data['position'][0],
                                                   dist_data['position'][1],
                                                   dist_data['system'],
                                                   dist_data['loads']['Fx'],
                                                   dist_data['loads']['Fy'],
                                                   dist_data['loads']['Fz'],
                                                   dist_data['loads']['Mx'],
                                                   dist_data['loads']['My'],
                                                   dist_data['loads']['Mz'])


    # Analysis and return /////////////////////////////////////////////////////////////////////////
    linear_analysis = Linear(nodes, bars, loads, supports)
    return linear_analysis
