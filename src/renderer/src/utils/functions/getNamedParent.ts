import * as THREE from 'three'

export const getNamedParent = (object: THREE.Object3D): THREE.Object3D | null => {
	let obj: THREE.Object3D | null = object
	while (obj) {
		if (obj.name) return obj
		obj = obj.parent
	}
	return null
}
