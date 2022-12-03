export interface TestProps {
}
export class Test extends Component<TestProps> {

  render(props: TestProps) {
    return (
      <PanelSection title="Panel Section">
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={(e) =>
              showContextMenu(
                <Menu label="Menu" cancelText="CAAAANCEL" onCancel={() => {}}>
                  <MenuItem onSelected={() => {}}>Item #1</MenuItem>
                  <MenuItem onSelected={() => {}}>Item #2</MenuItem>
                  <MenuItem onSelected={() => {}}>Item #3</MenuItem>
                </Menu>,
                e.currentTarget ?? window
              )
            }
          >
            Server says yolo
          </ButtonItem>
        </PanelSectionRow>
  
        <PanelSectionRow>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={logo} />
          </div>
        </PanelSectionRow>
  
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => {
              Router.CloseSideMenus();
              Router.Navigate("/decky-plugin-test");
            }}
          >
            Router
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    );
  }
}
