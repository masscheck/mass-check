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
      boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.07)',
      borderRadius: '0.2rem',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    //borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 55,
      borderBottom: '0px solid rgba(0, 0, 0, .125)',
      color: 'rgba(85, 172, 238, 1)',
      fontWeight: 'bold',
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

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className='faq-container'>
      <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
          <Typography>What is MassCheck?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            MassCheck is a crowdsourcing platform for people to verify whether Tweets are true or fake.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon />}>
          <Typography>What do I do on MassCheck?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            You can choose to become an Investigator or a Juror. 
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" expandIcon={<ExpandMoreIcon />}>
          <Typography>Do I get anything in return?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Every action in MassCheck rewards you with XPX coins (crypto!).
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
