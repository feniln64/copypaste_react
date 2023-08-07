import CodeEditor from '@uiw/react-textarea-code-editor';
import { useState } from 'react'
import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
// import '../assets/content.css'
function Content() {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-2' }, { 'indent': '+2' }],
            ['link', 'image'],
            ['clean']
        ],
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]
    const [code, setCode] = React.useState(
        `function add(a, b) {\n  return a + b;\n}`
    );
    const [content, setContent] = useState('')
    const [isChecked, setIsChecked] = useState(false)

    const handlechange = (value) => {
        setContent(value)
        // setIsChecked(!isChecked)
        //remove this console.log after testing
        console.log(value, isChecked)
        
    }
    return (
        <>
            <div id='main' className="container card"  style={{ marginLeft: "auto" ,marginBottom:"100px"}}>
            <section className=" card-body ">
                <form  >
                    
                    <button type="submit" className="btn btn-primary btn-block mb-4">Create Contact</button>
                    <div className="form-check">
                        <label className="form-check-label" htmlFor="protected_content">
                            Protected Content
                        </label>
                        <input className="form-check-input" type="checkbox" value="" checked={isChecked} name='protected_content' id="protected_content" onChange={e => setIsChecked(e.target.checked)} />
                    </div>
                    <div className="form-outline quill-editor-full mb-4">
                        <label className="form-label" htmlFor="form4Example3">Message</label>
                        <ReactQuill theme="snow" value={content} onChange={value => handlechange(value)} modules={modules} formats={formats} />
                    </div>
               
                </form>
                </section>
            </div>
        </>
    )
}



export default Content
     {/* <div className="form-outline mb-4">
                        <CodeEditor
                            value={content}
                            language="js"
                            placeholder="Please enter JS code."
                            onChange={(evn) => setCode(evn.target.value)}
                            padding={15}
                            style={{
                                fontSize: 12,
                                backgroundColor: "#f5f5f5",
                                fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                            }}
                        />
                    </div> */}

                    {/* See what is being written */}
                    {/* <div style={{border: "1px solid black"}} className="form-outline mb-4">
                        <ReactQuill
                            value={content}
                            readOnly={true}
                            theme={"bubble"}
                        />
                    </div> */}