"""Módulo para operações matemáticas"""
from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np
from numpy.typing import NDArray
from numpy import float64

from ._material import Material
from ._node import Node
from ._section import Section

from ..functions import space_3d
from ..functions.engineering.reactions import point as pt
from ..functions.engineering.reactions import section as sc

from ..types import ReleasesType

if TYPE_CHECKING:
    from ._load import Load


class Bar:
    """Bar of the structure."""
    name: str # Name of the bar
    start_node: Node # Start node (i)
    end_node: Node # End node (j)
    section: Section # Section
    material: Material # Material
    rotation: float # Rotation in degrees around the bar axis
    master: str | None = None # Name of the master bar for get results
    dx: float # Difference in x between end and start node
    dy: float # Difference in y between end and start node
    dz: float # Difference in z between end and start node
    length: float # Length of the bar
    releases: dict[ReleasesType, bool] # Releases at the ends of the bar
    kl: NDArray[float64] # Matriz of local stiffness with releases
    kl_nr: NDArray[float64] # Matriz of local stiffness without releases
    r: NDArray[float64] # Matriz of rotation
    klg: NDArray[float64] # Matriz of global stiffness
    y_up: bool # Modify default up for compare with PyNite
    extreme_forces: dict[str, NDArray[float64]]
    vector_loads: NDArray[float64] # Vector of all loads in global coordinates

    def __init__(self,
                 name: str,
                 start_node: Node,
                 end_node: Node,
                 section: Section,
                 material: Material,
                 rotation: float = 0):
        """Bar of the structure.

        Args:
            name (str): Name of the bar
            start_node (Node): Start node (i)
            end_node (Node): End node (j)
            section (Section): Section
            material (Material): Material
            rotation (float): Rotation in degrees around the bar axis. Default is 0.
        """

        self.name = name
        self.start_node = start_node
        self.end_node = end_node
        self.section = section
        self.material = material
        self.rotation = rotation
        self.master = None
        self.dx = end_node.x - start_node.x
        self.dy = end_node.y - start_node.y
        self.dz = end_node.z - start_node.z
        self.length = np.sqrt(self.dx**2 + self.dy**2 + self.dz**2)
        self.releases: dict[ReleasesType, bool] = {
            'Dxi': False, 'Dyi': False, 'Dzi': False,
            'Rxi': False, 'Ryi': False, 'Rzi': False,
            'Dxj': False, 'Dyj': False, 'Dzj': False,
            'Rxj': False, 'Ryj': False, 'Rzj': False,
        }
        self.kl =  np.zeros([12, 12])
        self.kl_nr = np.zeros([12, 12])
        self.r =  np.zeros([12, 12])
        self.klg = np.zeros([12, 12])
        self.y_up = False
        self.extreme_forces = {}
        self.vector_loads = np.zeros(12)

    def calculate_klg(self) -> NDArray[float64]:
        """Transforma a matriz de rigidez local em global

        Args:
            bar (Bar): Barra

        Returns:
            ndarray: Matriz de rigidez global
        """
        r = self.r.copy()
        klg = self.r.T @ self.kl @ r

        self.klg = klg # Atribui ao objeto

        return klg


    def calculate_kl(self) -> NDArray[float64]:
        """Calcula a matriz de rigidez local da barra

        Args:
            bar (Bar): Barra

        Returns:
            ndarray: matriz de rigidez local
        """
        kl = np.zeros([12, 12])

        l = self.length
        a = self.section.properties['area']
        ix = self.section.properties['Ix']
        iy = self.section.properties['Iy']
        iz = self.section.properties['Iz']
        e = self.material.properties['E']
        g = self.material.properties['G']

        kl[0][0] = (e * a) / l
        kl[0][6] = -kl[0][0]
        kl[1][1] = (12 * e * iz) / l**3
        kl[1][5] = (6 * e * iz) / l**2
        kl[1][7] = -kl[1][1]
        kl[1][11] = kl[1][5]
        kl[2][2] = (12 * e * iy) / l**3
        kl[2][4] = (-6 * e * iy) / l**2
        kl[2][8] = -kl[2][2]
        kl[2][10] = kl[2][4]
        kl[3][3] = (g * ix) / l
        kl[3][9] = -kl[3][3]
        kl[4][4] = (4 * e * iy) / l
        kl[4][8] = -kl[2][4]
        kl[4][10] = (2 * e * iy) / l
        kl[5][5] = (4 * e * iz) / l
        kl[5][7] = -kl[1][5]
        kl[5][11] = (2 * e * iz) / l
        kl[6][6] = kl[0][0]
        kl[7][7] = kl[1][1]
        kl[7][11] = -kl[1][5]
        kl[8][8] = kl[2][2]
        kl[8][10] = -kl[2][4]
        kl[9][9] = kl[3][3]
        kl[10][10] = kl[4][4]
        kl[11][11] = kl[5][5]
        kl = kl + kl.T - np.diag(kl.diagonal())

        self.kl_nr = kl.copy() # Stores the matrix without considering releases

        # Apply releases //////////////////////////////////////////////////////////////////////////
        kl_releases = np.zeros([12, 12])
        releases_calculates: list[int] = []
        for index, value in enumerate(self.releases.values()):
            if value:
                l = index
            else:
                continue

            for j in range(12):
                if j in releases_calculates:
                    continue

                kl_bar = kl[j, l] / kl[l, l]
                for k in range(12):
                    if k in releases_calculates:
                        continue
                    kl_releases[j, k] = kl[j, k] - kl_bar * kl[l, k]

            kl = kl_releases.copy()
            releases_calculates.append(l)

        # /////////////////////////////////////////////////////////////////////////////////////////

        self.kl = kl # Atribui ao objeto

        return kl

    def calculate_r(self):
        """Calcula a matriz de rotação da barra

        Args:
            bar (Bar): Barra

        Returns:
            ndarray: Matriz de rotação
        """
        x1 = self.end_node.x
        y1 = self.end_node.y
        z1 = self.end_node.z

        dx = self.dx
        dy = self.dy
        dz = self.dz

        rot_aux = np.zeros([3, 3])
        rot_aux[0, 0] = dx / self.length
        rot_aux[0, 1] = dy / self.length
        rot_aux[0, 2] = dz / self.length

        # Assistant point for determinate xy to bar ////////////////////////////////////////////////
        # Initial Assistant point ******************************************************************
        if self.y_up:
            if dx != 0 or dz != 0:
                aux = np.array([x1, y1 + 1, z1])
            else:
                aux = np.array([x1 + 1, y1, z1])
        else:
            if dx != 0 or dy != 0: # If not vertical
                aux = np.array([x1, y1, z1 + 1])
            else:
                if dz > 0: # vertical up
                    aux = np.array([x1 - 1, y1, z1])
                else: # vertical down
                    aux = np.array([x1 + 1, y1, z1])

        # Rotate assistant point around x axis ****************************************************
        axis_up = 0 if self.y_up else -90  # sum -90 deg for z up
        rotation = np.deg2rad(self.rotation + axis_up)
        aux = space_3d.rotate_point_around_line(aux,
                                                self.start_node.position,
                                                self.end_node.position,
                                                rotation)
        # /////////////////////////////////////////////////////////////////////////////////////////

        dx = aux[0] - x1
        dy = aux[1] - y1
        dz = aux[2] - z1
        c = np.sqrt(dx**2 + dy**2 + dz**2)

        alpha = dx / c
        beta = dy / c
        gamma = dz / c

        dx = rot_aux[0, 1] * gamma - rot_aux[0, 2] * beta
        dy = rot_aux[0, 2] * alpha - rot_aux[0, 0] * gamma
        dz = rot_aux[0, 0] * beta - rot_aux[0, 1] * alpha
        c = np.sqrt(dx**2 + dy**2 + dz**2)

        rot_aux[2, 0] = dx / c
        rot_aux[2, 1] = dy / c
        rot_aux[2, 2] = dz / c

        rot_aux[1, 0] = rot_aux[0, 2] * rot_aux[2, 1] - rot_aux[0, 1] * rot_aux[2, 2]
        rot_aux[1, 1] = rot_aux[0, 0] * rot_aux[2, 2] - rot_aux[0, 2] * rot_aux[2, 0]
        rot_aux[1, 2] = rot_aux[0, 1] * rot_aux[2, 0] - rot_aux[0, 0] * rot_aux[2, 1]

        rotation = np.zeros([12, 12])

        rotation[0:3, 0:3] = rot_aux
        rotation[3:6, 3:6] = rot_aux
        rotation[6:9, 6:9] = rot_aux
        rotation[9:12, 9:12] = rot_aux

        self.r = rotation # Atribui matriz de rotação no objeto barra

        return rotation

    def calculate_forces_vector(self, load: Load):
        """Calculate the vector of forces in global coordinates considering releases

        Args:
            load (Load): Load
        """
        if self in load.bars_loads_pt:
            # Point loads in bars /////////////////////////////////////////////////////////////////
            for value in load.bars_loads_pt.get(self, {}).values():
                system = value['system']
                fx = value['Fx']
                fy = value['Fy']
                fz = value['Fz']
                mx = value['Mx']
                my = value['My']
                mz = value['Mz']

                if system == 'global':
                    fx, fy, fz, mx, my, mz = self.r[0:6, 0:6] @ np.array([fx, fy, fz, mx, my, mz])

                x = value['position']
                l = self.length

                loads_vector = np.zeros(12)
                fxr = pt.force_x(l, x, fx) # Reactions due to the force on x
                fyr = pt.force_y(l, x, fy) # Reactions due to the force on y
                fzr = pt.force_z(l, x, fz) # Reactions due to the force on z
                mxr = pt.moment_x(l, x, mx) # Reactions because of the moment on x
                myr = pt.moment_y(l, x, my) # Reactions because of the moment on y
                mzr = pt.moment_z(l, x, mz) # Reactions because of the moment on z

                loads_vector[0] -= fxr['Rxa'] # Force in x initial
                loads_vector[6] -= fxr['Rxb'] # Force in x final
                loads_vector[1] -= fyr['Rya'] + mzr['Rya'] # Force in y initial
                loads_vector[7] -= fyr['Ryb'] + mzr['Ryb'] # Force in y final
                loads_vector[2] -= fzr['Rza'] + myr['Rza'] # Force in z initial
                loads_vector[8] -= fzr['Rzb'] + myr['Rzb'] # Force in z final
                loads_vector[3] -= mxr['Mxa'] # Moment in x initial
                loads_vector[9] -= mxr['Mxb'] # Moment in x final
                loads_vector[4] -= fzr['Mya'] + myr['Mya'] # Moment in y initial
                loads_vector[10] -= fzr['Myb'] + myr['Myb'] # Moment in y final
                loads_vector[5] -= fyr['Mza'] + mzr['Mza'] # Moment in z initial
                loads_vector[11] -= fyr['Mzb'] + mzr['Mzb'] # Moment in z final

                # Apply releases to the loads vector before transforming to global coordinates
                self.vector_loads += self.r.T @ self.apply_loads_releases(self.kl_nr, loads_vector)

        # Distributed loads in bars ///////////////////////////////////////////////////////////////
        for value in load.bars_loads_dist.get(self, {}).values():
            system = value['system']
            fx1, fx2 = value['Fx']
            fy1, fy2 = value['Fy']
            fz1, fz2 = value['Fz']
            mx1, mx2 = value['Mx']
            my1, my2 = value['My']
            mz1, mz2 = value['Mz']

            if system == 'global':
                fx1, fy1, fz1, mx1, my1, mz1 = self.r[0:6, 0:6] @ np.array([fx1, fy1, fz1,
                                                                            mx1, my1, mz1])
                fx2, fy2, fz2, mx2, my2, mz2 = self.r[0:6, 0:6] @ np.array([fx2, fy2, fz2,
                                                                            mx2, my2, mz2])

            x1 = value['x1']
            x2 = value['x2']
            l = self.length

            loads_vector = np.zeros(12)

            fxr = sc.force_x_trap(l, x1, x2, fx1, fx2) # Reactions due to the force on x
            fyr = sc.force_y_trap(l, x1, x2, fy1, fy2) # Reactions due to the force on y
            fzr = sc.force_z_trap(l, x1, x2, fz1, fz2) # Reactions due to the force on z
            mxr = sc.moment_x_trap(l, x1, x2, mx1, mx2) # Reactions due to the moment on x
            myr = sc.moment_y_trap(l, x1, x2, my1, my2) # Reactions due to the moment on y
            mzr = sc.moment_z_trap(l, x1, x2, mz1, mz2) # Reactions due to the moment on z

            loads_vector[0] -= fxr['Rxa'] # Force in x initial
            loads_vector[6] -= fxr['Rxb'] # Force in x final
            loads_vector[1] -= fyr['Rya'] + mzr['Rya'] # Force in y initial
            loads_vector[7] -= fyr['Ryb'] + mzr['Ryb'] # Force in y final
            loads_vector[2] -= fzr['Rza'] + myr['Rza'] # Force in z initial
            loads_vector[8] -= fzr['Rzb'] + myr['Rzb'] # Force in z final
            loads_vector[3] -= mxr['Mxa'] # Moment in x initial
            loads_vector[9] -= mxr['Mxb'] # Moment in x final
            loads_vector[4] -= fzr['Mya'] + myr['Mya'] # Moment in y initial
            loads_vector[10] -= fzr['Myb'] + myr['Myb'] # Moment in y final
            loads_vector[5] -= fyr['Mza'] + mzr['Mza'] # Moment in z initial
            loads_vector[11] -= fyr['Mzb'] + mzr['Mzb'] # Moment in z final

            # Apply releases to the loads vector before transforming to global coordinates
            self.vector_loads += self.r.T @ self.apply_loads_releases(self.kl_nr, loads_vector)

    def apply_loads_releases(self,
                             kl_nr: NDArray[float64],
                             loads_vector: NDArray[float64],
                             tol: float=1e-12):
        """Apply releases to the loads vector before transforming to global coordinates

        Args:
            kl_nr (NDArray[float64]): Stiffness matrix without releases
            loads_vector (NDArray[float64]): Vector of loads
            tol (float, optional): Tolerance for singularity check. Defaults to 1e-12.

        Returns:
            NDArray[float64]: Condensed loads vector with released DOFs zeroed and loads
                redistributed to maintained DOFs.
        """
        release_mask = np.array([
                self.releases['Dxi'], self.releases['Dyi'], self.releases['Dzi'],
                self.releases['Rxi'], self.releases['Ryi'], self.releases['Rzi'],
                self.releases['Dxj'], self.releases['Dyj'], self.releases['Dzj'],
                self.releases['Rxj'], self.releases['Ryj'], self.releases['Rzj']
                ], dtype=bool)
        # Index of maintained and released DOFs
        r_idx = np.where(release_mask)[0]
        k_idx = np.where(~release_mask)[0]

        # If no releases, return as is
        if r_idx.size == 0:
            return loads_vector.copy()

        # Partitions K and f
        # k_kk = kl_no_releases[np.ix_(k_idx, k_idx)]
        k_kr = kl_nr[np.ix_(k_idx, r_idx)]
        k_rr = kl_nr[np.ix_(r_idx, r_idx)]

        f_k = loads_vector[k_idx]
        f_r = loads_vector[r_idx]

        # Try resolving K_rr x = f_r; if singular, use pseudo-inverse
        try:
            # Check simple determinant/conditioning
            if np.linalg.cond(k_rr) < 1.0 / tol:
                krr_inv = np.linalg.inv(k_rr)
            else:
                krr_inv = np.linalg.pinv(k_rr)
        except np.linalg.LinAlgError:
            krr_inv = np.linalg.pinv(k_rr)

        # Calculate the redistributed contribution
        add_on_k = k_kr @ (krr_inv @ f_r)

        # f_condensed for DOFs maintained:
        f_k_cond = f_k - add_on_k

        # Construct resulting vector (released = 0)
        loads_condensed = np.zeros_like(loads_vector)
        loads_condensed[k_idx] = f_k_cond
        # loads_condensed[r_idx] = 0

        return loads_condensed
