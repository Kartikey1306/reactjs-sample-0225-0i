import { shallow, mount } from "enzyme"
import AlertMessage from "@/components/alert-message"

describe("AlertMessage Component", () => {
  it("renders the message correctly", () => {
    const message = "This is a test alert."
    const wrapper = shallow(<AlertMessage message={message} />)
    expect(wrapper.text()).toContain(message)
  })

  it("applies default info styles when no type is provided", () => {
    const wrapper = mount(<AlertMessage message="Info alert" />) // mount to check className on the div
    expect(wrapper.find('div[role="alert"]').hasClass("bg-blue-100")).toBe(true)
    expect(wrapper.find('div[role="alert"]').hasClass("text-blue-700")).toBe(true)
  })

  it('applies success styles when type is "success"', () => {
    const wrapper = mount(<AlertMessage message="Success alert" type="success" />)
    expect(wrapper.find('div[role="alert"]').hasClass("bg-green-100")).toBe(true)
    expect(wrapper.find('div[role="alert"]').hasClass("text-green-700")).toBe(true)
  })

  it('applies error styles when type is "error"', () => {
    const wrapper = mount(<AlertMessage message="Error alert" type="error" />)
    expect(wrapper.find('div[role="alert"]').hasClass("bg-red-100")).toBe(true)
    expect(wrapper.find('div[role="alert"]').hasClass("text-red-700")).toBe(true)
  })

  // You can add more tests for other types, props, etc.
})

// To run tests (in your local terminal):
// npm test
// or
// yarn test
