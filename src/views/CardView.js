import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ReactQuill from 'react-quill';
const modules = {
    toolbar: [
    ],
};
const formats = [];
const CardView = (props) => {
    return (
        
            <Card id={props._id} style={{ width: '18rem' }}>
                <Card.Body>
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