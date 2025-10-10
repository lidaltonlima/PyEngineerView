"""Calculate structure from excel file."""

import warnings

from pandas import read_excel # type: ignore

from pyengineer import Material, Section, Node, Bar, Support, Load
from pyengineer.analysis import Linear

warnings.filterwarnings("ignore", category=UserWarning, module='openpyxl')

def calculate_excel(path: str, load_name: str) -> Linear:
    """Calculate structure from excel file."""
    # Load data from excel file ///////////////////////////////////////////////////////////////////
    # Materials ***********************************************************************************
    df_materials = read_excel(path, sheet_name='Materials')
    materials: dict[str, Material] = {}
    for _index, row in df_materials.iterrows():
        materials[row['Name']] = Material(name=row['Name'],
                                          e=row['E'],
                                          g=row['G'],
                                          nu=row['nu'],
                                          rho=row['rho'])

    # Sections ************************************************************************************
    df_sections = read_excel(path, sheet_name='Sections')
    sections: dict[str, Section] = {}
    for _index, row in df_sections.iterrows():
        sections[row['Name']] = Section(name=row['Name'],
                                        area=row['Area'],
                                        ix=row['Ix'],
                                        iy=row['Iy'],
                                        iz=row['Iz'],)

    # Nodes ***************************************************************************************
    df_nodes = read_excel(path, sheet_name='Nodes')
    nodes: dict[str, Node] = {}
    for _index, row in df_nodes.iterrows():
        nodes[row['Name']] = Node(name=row['Name'],
                                  position=[row['X'], row['Y'], row['Z']])

    # Bars ****************************************************************************************
    df_bars = read_excel(path, sheet_name='Bars')
    bars: dict[str, Bar] = {}
    for _index, row in df_bars.iterrows():
        bars[row['Name']] = Bar(name=row['Name'],
                                start_node=nodes[row['Start Node']],
                                end_node=nodes[row['End Node']],
                                material=materials[row['Material']],
                                section=sections[row['Section']],
                                rotation=row['Rotation'],
                                )
        if isinstance(row['Releases'], str):
            releases = [item.strip() for item in row['Releases'].split(';')]
            bars[row['Name']].releases = \
                {'Dxi': 'Dxi' in releases, 'Dyi': 'Dyi' in releases, 'Dzi': 'Dzi' in releases,
                'Rxi': 'Rxi' in releases, 'Ryi': 'Ryi' in releases, 'Rzi': 'Rzi' in releases,
                'Dxj': 'Dxj' in releases, 'Dyj': 'Dyj' in releases, 'Dzj': 'Dzj' in releases,
                'Rxj': 'Rxj' in releases, 'Ryj': 'Ryj' in releases, 'Rzj': 'Rzj' in releases}

    # Supports ************************************************************************************
    df_supports = read_excel(path, sheet_name='Supports')
    supports = Support()
    for _index, row in df_supports.iterrows():
        supports.add_support(
            node=nodes[row['Node']],
            dx=True if row['Dx'] == 'True' else False if row['Dx'] == 'False' else row['Dx'],
            dy=True if row['Dy'] == 'True' else False if row['Dy'] == 'False' else row['Dy'],
            dz=True if row['Dz'] == 'True' else False if row['Dz'] == 'False' else row['Dz'],
            rx=True if row['Rx'] == 'True' else False if row['Rx'] == 'False' else row['Rx'],
            ry=True if row['Ry'] == 'True' else False if row['Ry'] == 'False' else row['Ry'],
            rz=True if row['Rz'] == 'True' else False if row['Rz'] == 'False' else row['Rz'])

    # Loads ***************************************************************************************
    loads = Load(load_name)

    # Nodal Loads ---------------------------------------------------------------------------------
    df_node_loads = read_excel(path, sheet_name='Node Loads')
    for _index, row in df_node_loads.iterrows():
        loads.add_node_load(name=row['Name'],
                            node=nodes[row['Node']],
                            fx=row['Fx'],
                            fy=row['Fy'],
                            fz=row['Fz'],
                            mx=row['Mx'],
                            my=row['My'],
                            mz=row['Mz'])

    # Bar Point Loads -----------------------------------------------------------------------------
    df_bar_point_loads = read_excel(path, sheet_name='Bar Point Loads')
    for _index, row in df_bar_point_loads.iterrows():
        loads.add_bar_load_pt(name=row['Name'],
                              bar=bars[row['Bar']],
                              position=row['Position'],
                              system=row['System'].lower(),
                              fx=row['Fx'],
                              fy=row['Fy'],
                              fz=row['Fz'],
                              mx=row['Mx'],
                              my=row['My'],
                              mz=row['Mz'])
    # Bar Distributed Loads -----------------------------------------------------------------------
    df_bar_distributed_loads = read_excel(path, sheet_name='Bar Distributed Loads')
    for _index, row in df_bar_distributed_loads.iterrows():
        loads.add_bar_load_dist(name=row['Name'],
                                bar=bars[row['Bar']],
                                system=row['System'].lower(),
                                x1=row['Start Position'],
                                x2=row['End Position'],
                                fx=(row['Fx Start'], row['Fx End']),
                                fy=(row['Fy Start'], row['Fy End']),
                                fz=(row['Fz Start'], row['Fz End']),
                                mx=(row['Mx Start'], row['Mx End']),
                                my=(row['My Start'], row['My End']),
                                mz=(row['Mz Start'], row['Mz End']))

    return Linear(nodes=list(nodes.values()),
                  bars=list(bars.values()),
                  supports=supports,
                  loads=[loads])
