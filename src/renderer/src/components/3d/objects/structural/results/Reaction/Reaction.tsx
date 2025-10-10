import { Force } from './Force'
import { Moment } from './Moment'

interface IReactionCustomProps {
	fx?: number
	fy?: number
	fz?: number
	mx?: number
	my?: number
	mz?: number

	label?: boolean
}

type IReactionProps = IReactionCustomProps & React.JSX.IntrinsicElements['group']

export const Reaction = ({
	fx = 0,
	fy = 0,
	fz = 0,
	mx = 0,
	my = 0,
	mz = 0,
	label = false,
	...groupProps
}: IReactionProps): React.JSX.Element => {
	return (
		<group {...groupProps}>
			{/* Positive values */}
			{fx > 0 && <Force direction='x' value={fx} label={label} arrowColor='red' textColor='red' />}
			{fy > 0 && (
				<Force direction='y' value={fy} label={label} arrowColor='green' textColor='green' />
			)}
			{fz > 0 && (
				<Force direction='z' value={fz} label={label} arrowColor='blue' textColor='blue' />
			)}
			{mx > 0 && (
				<Moment direction='x' value={mx} label={label} arrowColor='red' labelColor='red' />
			)}
			{my > 0 && (
				<Moment direction='y' value={my} label={label} arrowColor='green' labelColor='green' />
			)}
			{mz > 0 && (
				<Moment direction='z' value={mz} label={label} arrowColor='blue' labelColor='blue' />
			)}
			{/* Negative values */}
			{fx < 0 && (
				<Force direction='-x' value={fx} label={label} arrowColor='#ff6666' textColor='#ff6666' />
			)}
			{fy < 0 && (
				<Force direction='-y' value={fy} label={label} arrowColor='#00e600' textColor='#00e600' />
			)}
			{fz < 0 && (
				<Force direction='-z' value={fz} label={label} arrowColor='#6666ff' textColor='#6666ff' />
			)}
			{mx < 0 && (
				<Moment direction='-x' value={mx} label={label} arrowColor='#ff6666' labelColor='#ff6666' />
			)}
			{my < 0 && (
				<Moment direction='-y' value={my} label={label} arrowColor='#00e600' labelColor='#00e600' />
			)}
			{mz < 0 && (
				<Moment direction='-z' value={mz} label={label} arrowColor='#6666ff' labelColor='#6666ff' />
			)}
		</group>
	)
}
