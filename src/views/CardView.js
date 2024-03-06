import Card from 'react-bootstrap/Card';
import ReactQuill from 'react-quill';
import { MdDeleteForever } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import { Button } from 'react-bootstrap';
const modules = {
    toolbar: [
    ],
};
const formats = [];
const CardView = (props) => {
    return (

        <Card id={props._id} style={{ width: '18rem' }}>
            <Card.Body>
                <Button className='mt-2'  onClick={() => props.editContent(props._id)}><RiEditBoxFill /></Button>{' '}
                <Button className='mt-2'  variant="danger" onClick={() => props.deleteContent(props._id)}><MdDeleteForever /></Button>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>
                    <ReactQuill
                        modules={modules}
                        formats={formats}
                        style={{ height: "auto", border: "none" }}
                        readOnly={true}
                        value={props.content}
                    />
                </Card.Text>
            </Card.Body>
        </Card>

    );
}

export default CardView;