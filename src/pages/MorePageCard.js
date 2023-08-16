import { BookmarkBorder } from '@mui/icons-material';
import { Card, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const MorePageCard = ({ linkTo, icon, title }) => {
    return (
        <Col>
            <Card as={Link} to={linkTo} style={{ textDecoration: 'none', color: 'black' }}>
                <Card.Body>
                    {icon} {title}
                </Card.Body>
                <CardActions>
                    <IconButton>
                        <HomeOutlined />
                    </IconButton>
                    <IconButton>
                        <BookmarkBorder />
                    </IconButton>
                </CardActions>
            </Card>
        </Col>
    );
}

export default MorePageCard;