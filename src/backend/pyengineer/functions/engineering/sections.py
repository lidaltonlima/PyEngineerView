"""Sections functions"""
import math
from copy import deepcopy

from ...objects import Section

def rotate_section_about_x(section: Section, angle: float) -> Section:
    """
    Rotaciona uma seção em torno do eixo x, retornando uma nova seção com as inércias transformadas.

    Args:
        section (Section): Seção original.
        angle_deg (float): Ângulo de rotação em graus (sentido positivo conforme convenção padrão).

    Returns:
        Section: Nova seção com inércias transformadas.
    """
    # Converter graus para radianos
    theta = math.radians(angle)

    # Extrair propriedades originais
    iy = section.properties["Iy"]
    iz = section.properties["Iz"]

    # Calcular inércias transformadas
    iy_rot = iy * math.cos(theta)**2 + iz * math.sin(theta)**2
    iz_rot = iy * math.sin(theta)**2 + iz * math.cos(theta)**2

    # Criar nova seção (mantém nome com indicação da rotação)
    new_section = deepcopy(section)
    new_section.name = f"{section.name}_rot{angle}deg"
    new_section.properties["Iy"] = iy_rot
    new_section.properties["Iz"] = iz_rot

    return new_section
