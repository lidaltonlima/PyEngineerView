export const LightBase = (): React.JSX.Element => {
	return (
		<>
			<directionalLight position={[5, 0, 0]} intensity={0.8} />
			<directionalLight position={[-5, 0, 0]} intensity={0.7} />
			<directionalLight position={[0, 5, 0]} intensity={0.9} />
			<directionalLight position={[0, -5, 0]} intensity={0.6} />
			<directionalLight position={[0, 0, 5]} intensity={1} />
			<directionalLight position={[0, 0, -5]} intensity={0.5} />
		</>
	)
}
