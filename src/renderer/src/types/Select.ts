import { Dispatch, SetStateAction } from 'react'
import { IEntityData } from './Entity'

export type selectionType = [IEntityData[], Dispatch<SetStateAction<IEntityData[]>>]
