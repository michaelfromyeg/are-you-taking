import renderer from "react-test-renderer";

import Header from "../components/Header";

test("Header", () => {
  const component = renderer.create(<Header text="Hello, world!" />);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
