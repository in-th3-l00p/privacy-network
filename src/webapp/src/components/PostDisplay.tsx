import React from "react";
import {Post} from "../util/serverTypes";
import {Button, ButtonGroup, Col, Row} from "react-bootstrap";

const PostDisplay: React.FC<{ post: Post }> = ({post}) => {
    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${date.getDay()}-${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`;
    }

    return (
        <div className={"border p-3 bg-white"}>
            <Row>
                <Col>
                    <h4>{typeof post.user !== "undefined" ? post.user.username : "[deleted]"}</h4>
                </Col>
                <Col>
                    <p className={"text-muted"} style={{textAlign: "right"}}>{formatDate(post.postDate)}</p>
                </Col>
            </Row>
            <Row><Col><p>{post.text}</p></Col></Row>
            <Row>
                <Col>
                    <ButtonGroup>
                        <Button variant={"dark"}>{post.likes} 👍</Button>
                        <Button variant={"dark"}>{post.dislikes} 👎</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </div>
    )
}

export default PostDisplay;