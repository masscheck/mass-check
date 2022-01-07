import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Accordion = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    //border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    width: '40rem',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      marginTop: 'auto',
      marginBottom: 'auto',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0px 4px 30px -15px rgba(191, 174, 227, 0.45)',
      borderRadius: '0.2rem',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'rgba(102, 117, 127, 1)',
    //borderBottom: '1px solid rgba(0, 0, 0, .125)',
    // marginBottom: -1,
    minHeight: 40,
    '&$expanded': {
      minHeight: 40,
      borderBottom: '0px solid rgba(0, 0, 0, .125)',
      color: 'rgba(105, 50, 227, 1)',
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function CustomizedAccordions(Props) {
  const [expanded, setExpanded] = React.useState<string | false>('');

  const handleChange =
    (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div className='faq-container'>
      <Accordion
        square
        expanded={expanded === 'panel'}
        onChange={handleChange('panel')}
      >
        <AccordionSummary
          aria-controls='paneld-content'
          id='paneld-header'
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>{Props.question}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{Props.answer}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
