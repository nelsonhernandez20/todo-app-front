import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';

//Components
import Layout from '../components/Layout';
import { saveTask, getTask, updateTask } from '../api';

// libraries
import * as SQLite from 'expo-sqlite';

const TaskFormScreen = ({ navigation, route }) => {
	const db = SQLite.openDatabase('tarea');

	const [task, setTask] = useState({
		title: '',
		description: '',
	});
	const [editing, setEditing] = useState(false);
	const handleChange = (name, value) => setTask({ ...task, [name]: value });

	const saveTaskSQLITE = (task) => {
		db.transaction((txn) => {
			txn.executeSql(
				`INSERT INTO tasks(title,description) VALUES(?,?)`,
				[task.title, task.description],
				(sqlTxn: SQLTransaction, res: SQLResultSet) => {
					console.log('Se agrego una tarea');
				},
				(error) => {
					console.log('error' + error.message);
				}
			);
		});
	};

	const updateTaskSQLITE = (id, task) => {
		console.log(task);
		db.transaction((txn) => {
			txn.executeSql(
				`UPDATE tasks SET title= ?,description=? WHERE id=?`,
				[task.title, task.description, id],
				(sqlTxn: SQLTransaction, res: SQLResultSet) => {
					console.log('tabla aCtualizada');
				},
				(error) => {
					console.log('error' + error.message);
				}
			);
		});
	};

	const getTaskSQLITE = (id) => {
		db.transaction((txn) => {
			txn.executeSql(
				`SElECT * from tasks WHERE id = ?`,
				[id],
				(sqlTxn: SQLTransaction, res) => {
					console.log('Tareas Encontradas');
					let len = res.rows.length;
					if (len > 0) {
						let results = [];
						for (let i = 0; i < len; i++) {
							let item = res.rows.item(i);
							results.push({
								id: item.id,
								title: item.title,
								description: item.description,
							});
						}

						setTask({ title: results[0].title, description: results[0].description });
					}
				},
				(error) => {
					console.log(error.mesage);
				}
			);
		});
	};

	const handleSubmit = async () => {
		try {
			if (!editing) {
				// await saveTask(task);
				await saveTaskSQLITE(task);
			} else {
				// await updateTask(route.params.id, task);
				await updateTaskSQLITE(route.params.id, task);
			}
			navigation.navigate('HomeScreen');
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (route.params && route.params.id) {
			navigation.setOptions({ headerTitle: 'Updating a Task' });
			setEditing(true);
			(async () => {
				// const task = await getTask(route.params.id);
				await getTaskSQLITE(route.params.id);

				// setTask({ title: task.title, description: task.description });
			})();
		}
	}, []);

	return (
		<Layout>
			<TextInput
				placeholderTextColor="#546574"
				onChangeText={(text) => handleChange('title', text)}
				style={styles.input}
				placeholder="Write a Title"
				value={task.title}
			/>
			<TextInput
				placeholderTextColor="#546574"
				onChangeText={(text) => handleChange('description', text)}
				style={styles.input}
				placeholder="Write Description"
				value={task.description}
			/>

			{!editing ? (
				<TouchableOpacity style={styles.buttonSave} onPress={handleSubmit}>
					<Text style={styles.buttonText}>Save Task</Text>
				</TouchableOpacity>
			) : (
				<TouchableOpacity style={styles.buttonUpdate} onPress={handleSubmit}>
					<Text style={styles.buttonText}>Update Task</Text>
				</TouchableOpacity>
			)}
		</Layout>
	);
};

export default TaskFormScreen;

const styles = StyleSheet.create({
	input: {
		width: '90%',
		marginBottom: 7,
		fontSize: 14,
		borderWidth: 1,
		borderColor: '#10ac84',
		height: 35,
		color: '#ffffff',
		padding: 4,
		textAlign: 'center',
		borderRadius: 5,
	},
	buttonSave: {
		paddingVertical: 10,
		borderRadius: 5,
		marginBottom: 10,
		backgroundColor: '#10ac84',
		width: '90%',
	},
	buttonText: {
		color: '#ffffff',
		textAlign: 'center',
	},
	buttonUpdate: {
		padding: 10,
		paddingBottom: 10,
		borderRadius: 5,
		marginBottom: 3,
		backgroundColor: '#e58e26',
		width: '90%',
	},
});
