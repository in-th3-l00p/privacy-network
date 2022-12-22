import {User} from "../util/serverTypes";
import React, {useContext} from "react";
import {AuthenticationContext} from "../util/authentication";
import {Button, Modal} from "react-bootstrap";
import friendshipService from "../service/friendshipService";

interface RemoveFriendModalProps {
    friend: User;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    friendshipId: number;
    redirectUrl: string;
}

const RemoveFriendModal: React.FC<RemoveFriendModalProps> = ({friend, show, setShow, friendshipId, redirectUrl}) => {
    const authentication = useContext(AuthenticationContext);

    return (
        <Modal show={show} onHide={() => setShow(false)} backdrop={"static"}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to remove <b>{friend.username}</b> from your friend list.
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"dark"} onClick={() => setShow(false)}>Close</Button>
                <Button
                    variant={"danger"}
                    onClick={() => {
                        if (authentication.token)
                            friendshipService.removeFriendship(authentication.token, friendshipId)
                                .then(() => window.location.href = redirectUrl);
                    }}
                >
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default RemoveFriendModal;