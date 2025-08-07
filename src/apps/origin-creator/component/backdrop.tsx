import React from "react";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const styles = makeStyles((theme) => ({
    backdrop: {
        color: '#fff'
    }
}));

let setBlocker;
let blockers = 0;

export function Blocker(props) {
    const [open, setOpen] = React.useState(blockers > 0);
    setBlocker = setOpen;

    return <Backdrop className={styles().backdrop} open={open}>
        <CircularProgress color="inherit" />
    </Backdrop>;
}

export function block(i: number = 1) {
    if (setBlocker && blockers == 0) setBlocker(true);
    blockers += i;
}
export function unblock(i: number = 1) {
    blockers = Math.max(0, blockers - i);
    if (setBlocker && blockers == 0) setBlocker(false);
}

Object.assign(window, {
    block,
    unblock
});