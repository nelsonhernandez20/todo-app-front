import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';

//Components
import TaskList from '../components/TaskList.js';
import Layout from '../components/Layout.js';

// Libreries
import * as SQLite from 'expo-sqlite';

const HomeScreen = () => {
	const db = SQLite.openDatabase('tarea');

	const createTables = () => {
		db.transaction((txn) => {
			txn.executeSql(
				`CREATE TABLE IF NOT EXISTS "tasks"("id" INTEGER NOT NULL,"title" TEXT NOT NULL,"description" TEXT,PRIMARY KEY ("id" AUTOINCREMENT));`,
				[],
				(sql: SQLTransaction, res: SQLResultSet) => {
					console.log('table created successfully');
				},
				(error) => {
					console.log(error);
				}
			);
		});
	};

	useEffect(() => {
		createTables();
	}, []);

	return (
		<Layout>
			<TaskList />
		</Layout>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({});
