import Editor from '@monaco-editor/react';
import { Dropdown } from 'flowbite-react';
import { useState } from 'react';
import { useThemeMode } from 'flowbite-react';



export function CodeArea() {

    //define the props for the editor
    const [editor, setEditor] = useState({
                
        defaultValue : "##create your code here",
        languageId: 92,
        defaultLanguage : "python",
        value : "",
        language: "",
        theme: "vs-dark"
        }
);

    //define the types for the languages 
    type Language = {
        name: string;
        id: number;
    };

    //define an array for the programming languages

    const languagesList: Language[] = [
        { name: "Python", id: 92 },
        { name: "Javascript", id: 93 },
        { name: "TypeScript", id: 94 },
        { name: "Swift", id: 83 },
        { name: "Assembly", id: 45 },
        { name: "Bash", id: 46 },
        { name: "C", id: 75 },
        { name: "C++", id: 76 },
        { name: "C#", id: 51 },
        { name: "COBOL", id: 77 },
        { name: "D", id: 56 },
        { name: "Dart", id: 90 },
        { name: "Elixir", id: 57 },
        { name: "Erlang", id: 58 },
        { name: "F#", id: 87 },
        { name: "Fortran", id: 59 },
        { name: "Go", id: 95 },
        { name: "Grovy", id: 88 },
        { name: "Haskell", id: 61 },
        { name: "Kotlin", id: 78 },
        { name: "Lua", id: 64 },
        { name: "Objective-C", id: 79 },
        { name: "Octave", id: 66 },
        { name: "Perl", id: 85 },
        { name: "R", id: 80 },
        { name: "Ruby", id: 72 },
        { name: "Scala", id: 81 },
    ];
    
    //set the state for changes on the code in the editor 

    function handleCodeChange (newValue:string|undefined){
        if (newValue !== undefined) {
            setEditor({...editor, value:newValue});

        }
    }
    // when a language is selected on the dropdown, the editor language change so it can give better recommendations
    // we also change the language id which is needed for the api
    
    function handleLanguageChange (newLanguage:string|undefined, newLanguageId:number|undefined) {
        if (newLanguage !== undefined && newLanguageId !== undefined) {
            setEditor({...editor, language:newLanguage.toLowerCase(), languageId:newLanguageId});
            console.log(newLanguage.toLowerCase(), newLanguageId)
        }
    }
    
    return (
        <>
            <Dropdown label="dropdown-language" inline className=''>
                {languagesList.map((language) => 
                <Dropdown.Item key={language.id} onClick={() => handleLanguageChange(language.name, language.id)} >{language.name}</Dropdown.Item>
                    )
                }
            </Dropdown>
                <Editor
                className ="min-h-full"
                height="90vh"
                defaultLanguage ={editor.defaultLanguage}
                defaultValue = {editor.defaultValue}
                language={editor.language}
                theme='vs-dark'
                onChange={handleCodeChange}
                />
        </>
            )
        }
