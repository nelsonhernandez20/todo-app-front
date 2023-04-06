import { FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import TaskItem from './TaskItem';

//API
import { deleteTask, getTasks } from '../api.js';

// Libraries
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from '@react-navigation/native';

const TaskList = () => {
	const db = SQLite.openDatabase('tarea');

	const [tasks, setTasks] = useState([]);
	const [refresing, setRefresing] = useState(false);

	const isFocused = useIsFocused();

	const getTasksSQLITE = () => {
		db.transaction((txn) => {
			txn.executeSql(
				`SELECT * from tasks`,
				[],
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
						setTasks(results);
					}
				},
				(error) => {
					console.log(error.mesage);
				}
			);
		});
	};

	const deleteTaskSQLITE = (id) => {
		db.transaction((txn) => {
			txn.executeSql(
				`DELETE FROM tasks WHERE id = ?`,
				[id],
				(sqlTxn: SQLTransaction, res: SQLResultSet) => {
					console.log('se elimino una Tarea');
				},
				(error) => {
					console.log('error' + error.message);
				}
			);
		});
	};

	const loadTasks = async () => {
		// const data = await getTasks();
		// setTasks(data);
		await getTasksSQLITE();
	};

	useEffect(() => {
		loadTasks();
	}, [isFocused]);

	const handleDelete = async (id) => {
		// await deleteTask(id);
		setTasks([]);
		await deleteTaskSQLITE(id);
		await loadTasks();
	};

	const renderItem = ({ item }) => {
		return <TaskItem task={item} handleDelete={handleDelete} />;
	};

	const onRefresh = React.useCallback(async () => {
		setRefresing(true);
		await loadTasks();
		setRefresing(false);
	});

	return (
		<FlatList
			data={tasks}
			keyExtractor={(item) => item.id + ''}
			renderItem={renderItem}
			style={{ width: '100%' }}
			refreshControl={
				<RefreshControl
					progressBackgroundColor="#0a3d62"
					refreshing={refresing}
					colors={['#78e08f']}
					onRefresh={onRefresh}
				/>
			}
		/>
	);
};

export default TaskList;
