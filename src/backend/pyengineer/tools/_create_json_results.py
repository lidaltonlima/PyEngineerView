"""Create JSON results file for calculated structure"""
import json

from ..analysis._linear import Linear


def create_json_results(path: str, analysis: Linear) -> None:
    """Create a JSON results file for the linear analysis.

    Args:
        path (str): The path to the JSON file to create.
        analysis (Linear): The linear analysis object containing results.
    """
    # Results /////////////////////////////////////////////////////////////////////////////////////
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

    # Write results to JSON file //////////////////////////////////////////////////////////////////
    with open(path, 'w', encoding='utf-8') as file:
        json.dump(results, file, indent=2)
