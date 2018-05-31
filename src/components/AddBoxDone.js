import React from "react";
import PropTypes from "prop-types";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DialogToolbar from "./DialogToolbar";

const AddBoxDone = ({ box, selectedProduct, onClose, onReset }) => (
  <div>
    <DialogToolbar
      title="New box"
      onClose={onClose}
      buttonText="Done"
      onClickButton={onClose}
    />
    <DialogContent>
      <br />
      <Typography variant="title" gutterBottom>
        Box created
      </Typography>
      <Typography variant="body1" gutterBottom>
        Write on the label:
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>
          {selectedProduct.category} {selectedProduct.name} {box.quantity}x
        </strong>
      </Typography>
      <Button onClick={onReset} color="primary">
        Create another box
      </Button>
    </DialogContent>
  </div>
);

AddBoxDone.propTypes = {
  box: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};

export default AddBoxDone;