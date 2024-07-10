import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";

import { AdminXASStandard } from "../../models";

import { useState } from "react";
import axios from "axios";
import { AxiosResponse, AxiosError } from "axios";

const review_statuses = ["pending", "approved", "rejected"];
const standards_url = "/api/standards";

export default function ReviewCard(props: { standard: AdminXASStandard }) {
  const [reviewStatus, setReviewStatus] = useState("pending");
  const [reviewerComments, setReviewerComments] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .patch(standards_url, {
        reviewer_comments: reviewerComments,
        review_status: reviewStatus,
        standard_id: props.standard.id,
      })
      .then(() => {
        window.alert("Thank you for your review");
      })
      .catch((reason: AxiosError) => {
        window.alert(reason.message);
      });
  };
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography>
            Submitted by: {props.standard.submitter.identifier}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="centre"
            component="form"
            id="submissionform"
            onSubmit={handleSubmit}
            gap={7}
          >
            <Stack>
              <FormControl fullWidth>
                <InputLabel margin="dense" id="review_status">
                  Review Status
                </InputLabel>
                <Select
                  name="review_status"
                  id="review_status"
                  label="Review Status"
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                >
                  {review_statuses.map((x, y) => (
                    <MenuItem key={y} value={x}>
                      {x}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                id="scomments"
                label="Comments"
                variant="outlined"
                value={reviewerComments}
                onChange={(e) => setReviewerComments(e.target.value)}
              />
              <Button type="submit">Submit</Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
