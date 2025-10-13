import { useSelectionContext } from '@renderer/contexts/Selection'
import { useStructureContext } from '@renderer/contexts/Structure'
import React, { useEffect, useState } from 'react'
import styles from './Results.module.scss'

export const Results = (): React.JSX.Element => {
	const { selection } = useSelectionContext()
	const { structure } = useStructureContext()
	const { clickVoid } = useSelectionContext()
	const [results, setResults] = useState<React.JSX.Element>(<></>)
	const isClickVoid = clickVoid[0]

	useEffect(() => {
		if (!(structure.results === undefined)) {
			if (isClickVoid) {
				setResults(<p>Click on a entity to see results.</p>)
			} else {
				if (selection[0].length === 1) {
					const selected = selection[0][0]
					if (selected.type == 'node') {
						const nodeResults = structure.results
							.find((result) => result.load_case === 'L1')
							?.displacements.find((displacement) => displacement.node === selected.name)
						setResults(
							<div className={styles.main}>
								<fieldset>
									<legend>Node Results</legend>
									<p>Name: {selected.name}</p>
									<fieldset>
										<legend>Displacements</legend>
										<p style={{ color: nodeResults!.Dx >= 0 ? 'green' : 'red' }}>
											<strong>Dx:</strong> {nodeResults?.Dx.toExponential(4)}
										</p>
										<p style={{ color: nodeResults!.Dy >= 0 ? 'green' : 'red' }}>
											<strong>Dy:</strong> {nodeResults?.Dy.toExponential(4)}
										</p>
										<p style={{ color: nodeResults!.Dz >= 0 ? 'green' : 'red' }}>
											<strong>Dz:</strong> {nodeResults?.Dz.toExponential(4)}
										</p>
									</fieldset>
									<fieldset>
										<legend>Rotations</legend>
										<p style={{ color: nodeResults!.Rx >= 0 ? 'green' : 'red' }}>
											<strong>Rx:</strong> {nodeResults?.Rx.toExponential(4)}
										</p>
										<p style={{ color: nodeResults!.Ry >= 0 ? 'green' : 'red' }}>
											<strong>Ry:</strong> {nodeResults?.Ry.toExponential(4)}
										</p>
										<p style={{ color: nodeResults!.Rz >= 0 ? 'green' : 'red' }}>
											<strong>Rz:</strong> {nodeResults?.Rz.toExponential(4)}
										</p>
									</fieldset>
								</fieldset>
							</div>
						)
					} else if (selected.type == 'bar') {
						const barResults = structure.results
							.find((result) => result.load_case === 'L1')
							?.extreme_forces.find((force) => force.bar === selected.name)
						setResults(
							<div className={styles.main}>
								<fieldset>
									<legend>Bar Results</legend>
									<p>Bar: {barResults?.bar}</p>
									<fieldset>
										<legend>Initial Node</legend>
										<fieldset>
											<legend>Forces</legend>
											<p style={{ color: barResults!.Fxi >= 0 ? 'green' : 'red' }}>
												<strong>Fx:</strong> {barResults?.Fxi.toExponential(4)}
											</p>
											<p style={{ color: barResults!.Fyi >= 0 ? 'green' : 'red' }}>
												<strong>Fy:</strong> {barResults?.Fyi.toExponential(4)}
											</p>
											<p style={{ color: barResults!.Fzi >= 0 ? 'green' : 'red' }}>
												<strong>Fz:</strong> {barResults?.Fzi.toExponential(4)}
											</p>
										</fieldset>
										<fieldset>
											<legend>Moments</legend>
											<p style={{ color: barResults!.Mxi >= 0 ? 'green' : 'red' }}>
												<strong>Mx:</strong> {barResults?.Mxi.toExponential(4)}
											</p>
											<p style={{ color: barResults!.Myi >= 0 ? 'green' : 'red' }}>
												<strong>My:</strong> {barResults?.Myi.toExponential(4)}
											</p>
											<p style={{ color: barResults!.Mzi >= 0 ? 'green' : 'red' }}>
												<strong>Mz:</strong> {barResults?.Mzi.toExponential(4)}
											</p>
										</fieldset>
									</fieldset>
									<fieldset>
										<legend>End Node</legend>
										<fieldset>
											<legend>Forces</legend>
											<p style={{ color: barResults!.Fxj >= 0 ? 'green' : 'red' }}>
												<strong>Fx:</strong> {barResults?.Fxj.toExponential(4)}
											</p>
											<p style={{ color: barResults!.Fyj >= 0 ? 'green' : 'red' }}>
												<strong>Fy:</strong> {barResults?.Fyj.toExponential(4)}
											</p>
											<p style={{ color: barResults!.Fzj >= 0 ? 'green' : 'red' }}>
												<strong>Fz:</strong> {barResults?.Fzj.toExponential(4)}
											</p>
										</fieldset>
										<fieldset>
											<legend>Moments</legend>
											<p style={{ color: barResults!.Mxj >= 0 ? 'green' : 'red' }}>
												<strong>Mx:</strong> {barResults?.Mxj.toExponential(4)}
											</p>
											<p style={{ color: barResults!.Myj >= 0 ? 'green' : 'red' }}>
												<strong>My:</strong> {barResults?.Myj.toExponential(4)}
											</p>
											<p style={{ color: barResults!.Mzj >= 0 ? 'green' : 'red' }}>
												<strong>Mz:</strong> {barResults?.Mzj.toExponential(4)}
											</p>
										</fieldset>
									</fieldset>
								</fieldset>
							</div>
						)
					} else if (selected.type == 'support') {
						const supportResults = structure.results
							.find((result) => result.load_case === 'L1')
							?.reactions.find((reaction) => reaction.node === selected.name)
						setResults(
							<div className={styles.main}>
								<fieldset>
									<legend>Support Results</legend>
									<p>Node: {supportResults?.node}</p>
									<fieldset>
										<legend>Forces</legend>
										<p style={{ color: supportResults!.Fx >= 0 ? 'green' : 'red' }}>
											<strong>Fx:</strong> {supportResults?.Fx.toExponential(4)}
										</p>
										<p style={{ color: supportResults!.Fy >= 0 ? 'green' : 'red' }}>
											<strong>Fy:</strong> {supportResults?.Fy.toExponential(4)}
										</p>
										<p style={{ color: supportResults!.Fz >= 0 ? 'green' : 'red' }}>
											<strong>Fz:</strong> {supportResults?.Fz.toExponential(4)}
										</p>
									</fieldset>
									<fieldset>
										<legend>Moments</legend>
										<p style={{ color: supportResults!.Mx >= 0 ? 'green' : 'red' }}>
											<strong>Mx:</strong> {supportResults?.Mx.toExponential(4)}
										</p>
										<p style={{ color: supportResults!.My >= 0 ? 'green' : 'red' }}>
											<strong>My:</strong> {supportResults?.My.toExponential(4)}
										</p>
										<p style={{ color: supportResults!.Mz >= 0 ? 'green' : 'red' }}>
											<strong>Mz:</strong> {supportResults?.Mz.toExponential(4)}
										</p>
									</fieldset>
								</fieldset>
							</div>
						)
					}
				}
			}
		}
	}, [selection, isClickVoid, structure])

	if (structure.results === undefined || structure.results.length === 0) {
		return <p>No results available. Calculate this structure or open a calculation structure.</p>
	} else {
		return results
	}
}
