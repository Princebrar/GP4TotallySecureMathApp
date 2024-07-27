import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import * as Keychain from 'react-native-keychain';
import Note from './components/Note';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TRootStackParamList } from './App';

export interface INote {
    title: string;
    text: string;
}

interface IProps {}

interface IState {
    notes: INote[];
    newNoteTitle: string;
    newNoteEquation: string;
}

type TProps = NativeStackScreenProps<TRootStackParamList, 'Notes'> & IProps;

export default class Notes extends React.Component<TProps, IState> {
    constructor(props: Readonly<TProps>) {
        super(props);

        this.state = {
            notes: [],
            newNoteTitle: '',
            newNoteEquation: ''
        };

        this.onNoteTitleChange = this.onNoteTitleChange.bind(this);
        this.onNoteEquationChange = this.onNoteEquationChange.bind(this);
        this.addNote = this.addNote.bind(this);
    }

    public async componentDidMount() {
        const existing = await this.getStoredNotes();
        this.setState({ notes: existing });
    }

    public async componentWillUnmount() {
        this.storeNotes(this.state.notes);
    }

    private async getStoredNotes(): Promise<INote[]> {
        // Securely retrieving user session data
        const credentials = await Keychain.getGenericPassword();

        if (credentials) {
            const value = await Keychain.getGenericPassword();
            
            if (value && typeof value === 'object' && 'password' in value) {
                return JSON.parse(value.password);
            }
        }

        return [];
    }

    private async storeNotes(notes: INote[]) {
        const jsonValue = JSON.stringify(notes);
        // Securely storing notes
        await Keychain.setGenericPassword('notes', jsonValue);
    }

    private onNoteTitleChange(value: string) {
        this.setState({ newNoteTitle: value });
    }

    private onNoteEquationChange(value: string) {
        this.setState({ newNoteEquation: value });
    }

    // Input sanitization function
    private sanitizeInput(input: string) {
        return input.replace(/[^a-zA-Z0-9 ]/g, '');
    }

    private addNote() {
        const sanitizedTitle = this.sanitizeInput(this.state.newNoteTitle);
        const sanitizedEquation = this.sanitizeInput(this.state.newNoteEquation);

        const note: INote = {
            title: sanitizedTitle,
            text: sanitizedEquation
        };

        this.setState(
            (prevState) => ({
                notes: [...prevState.notes, note],
                newNoteTitle: '',
                newNoteEquation: ''
            }),
            () => this.storeNotes(this.state.notes)
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>Notes</Text>
                    <TextInput
                        style={styles.input}
                        value={this.state.newNoteTitle}
                        onChangeText={this.onNoteTitleChange}
                        placeholder="Note Title"
                        // Input validation: Only allow alphanumeric characters and spaces
                        keyboardType="default"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        value={this.state.newNoteEquation}
                        onChangeText={this.onNoteEquationChange}
                        placeholder="Note Text"
                        // Input validation: Only allow alphanumeric characters and spaces
                        keyboardType="default"
                        autoCapitalize="none"
                    />
                    <Button title="Add Note" onPress={this.addNote} />
                    <View>
                        {this.state.notes.map((note, index) => (
                            <Note key={index} title={note.title} text={note.text} />
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
});
