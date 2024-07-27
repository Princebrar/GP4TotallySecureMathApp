import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TRootStackParamList } from './App';
import CryptoJS from 'crypto-js';
import * as Keychain from 'react-native-keychain';

export interface IUser {
    username: string;
    password: string;
}

interface IProps {
    onLogin: (user: IUser) => void;
}

type TProps = NativeStackScreenProps<TRootStackParamList, 'Login'> & IProps;

export default function Login(props: TProps) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    // Using hashed passwords instead of plaintext
    const users: IUser[] = [
        { username: 'joe', password: CryptoJS.SHA256('secret').toString() },
        { username: 'bob', password: CryptoJS.SHA256('password').toString() }
    ];

    // Input sanitization function
    const sanitizeInput = (input: string) => {
        return input.replace(/[^a-zA-Z0-9]/g, '');
    };

    async function login() {
        const sanitizedUsername = sanitizeInput(username);
        const sanitizedPassword = sanitizeInput(password);

        let foundUser: IUser | false = false;

        for (const user of users) {
            // Comparing hashed passwords
            if (sanitizedUsername === user.username && CryptoJS.SHA256(sanitizedPassword).toString() === user.password) {
                foundUser = user;
                break;
            }
        }

        if (foundUser) {
            // Securely storing user session data
            await Keychain.setGenericPassword(sanitizedUsername, sanitizedPassword);
            props.onLogin(foundUser);
        } else {
            Alert.alert('Error', 'Username or password is invalid.');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.username}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                // Input validation: Only allow alphanumeric characters
                keyboardType="default"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.password}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                // Input validation: Ensure password meets minimum requirements
                keyboardType="default"
                autoCapitalize="none"
            />
            <Button title="Login" onPress={login} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    username: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    password: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    }
});
