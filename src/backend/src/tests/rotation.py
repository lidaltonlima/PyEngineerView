"""Test"""
# pylint: disable=C0413
# Add project root to sys.path for imports ////////////////////////////////////////////////////////
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.join(current_dir, '..', '..')
sys.path.append(project_root)
# /////////////////////////////////////////////////////////////////////////////////////////////////
from pyengineer.objects import Section
from pyengineer.functions.engineering.sections import rotate_section_about_x

sec = Section("W150x13", area=1.63e-3, ix=1.39e-8, iy=6.2e-6, iz=8.28e-7)
print("Seção original:")
print(f"Nome: {sec.name}")
print(f"Área: {sec.properties['area']}")
print(f"Iy: {sec.properties['Iy']}")
print(f"Iz: {sec.properties['Iz']}")
rotated_sec = rotate_section_about_x(sec, 90)
print("\nSeção rotacionada 90 graus em torno do eixo x:")
print(f"Nome: {rotated_sec.name}")
print(f"Área: {rotated_sec.properties['area']}")
print(f"Iy: {rotated_sec.properties['Iy']}")
print(f"Iz: {rotated_sec.properties['Iz']}")
