import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";


export const Progress = (props) => {

    return (
        <Dialog modal="true" visible={props.value} resizable={false} closable={false} closeOnEscape={false} showHeader={false} contentStyle={{ background: "none" }} style={{ boxShadow: 'none' }}>
            <ProgressSpinner />
        </Dialog>
    );
};