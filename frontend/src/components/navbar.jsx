import { Nav, Navbar, Container, Button } from "react-bootstrap";

const navbar = () => {
	return (
		<Navbar bg="dark" variant="dark">
			<Container>
				<Container fluid>
					<Navbar.Brand>AFAM</Navbar.Brand>
                </Container>
                <Container fluid style={{display: "flex", justifyContent: "flex-end"}}>
                    <Button variant="dark" href="/login">Login</Button>
                    <Button variant="dark" href="/register" style={{marginLeft: '1vw'}}>Sign up</Button>
                </Container>
			</Container>
		</Navbar>
	);
};

export default navbar;
