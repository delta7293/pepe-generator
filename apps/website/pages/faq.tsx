import { Accordion, Container } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FaqPage() {
  return (
    <div
      style={{
        marginBottom: '100px',
      }}
    >
      <Header />
      <Footer />
      <Container maxWidth="md">
        <h1 style={{ marginTop: '2rem', fontFamily: 'Patrick Hand' }}>FAQ</h1>
        <div style={{ marginTop: '2rem', fontFamily: 'Patrick Hand' }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography style={{ fontFamily: 'Patrick Hand', fontSize: '1.5rem' }}>
                What is Pepe.fun?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography style={{ fontFamily: 'Patrick Hand', fontSize: '1.5rem' }}>
                PEPE.fun features hand-drawn artwork from Matt Furie, in edition format. ZOGZ Pepe
                is a 24 hour OPEN EDITION, open to public! HEDZ Pepe is a token gated mint for
                owners of Matt Furie&apos;s HEDZ NFTs.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography style={{ fontFamily: 'Patrick Hand', fontSize: '1.5rem' }}>
                Where can I find the collection on OpenSea?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography style={{ fontFamily: 'Patrick Hand', fontSize: '1.5rem' }}>
                <a
                  style={{ color: '#ff7b05' }}
                  target="_blank"
                  href="https://opensea.io/collection/pepe-open-editions-by-matt-furie"
                  rel="noreferrer"
                >
                  HERE
                </a>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography style={{ fontFamily: 'Patrick Hand', fontSize: '1.5rem' }}>
                How does the mint work?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography style={{ fontFamily: 'Patrick Hand', fontSize: '1.5rem' }}>
                ZOGZ PEPE is going live March 31th 2023 @ 1pm EST
                <ol>
                  <li style={{ marginBottom: '1rem' }}>
                    <b style={{ color: '#ff65e2' }}>ZOGZ Pepe Open Edition</b> - Open Edition, no
                    limit, public mint! 24 HOURS ONLY!
                  </li>
                  <li style={{ marginBottom: '1rem' }}>
                    <b style={{ color: '#ff65e2' }}>HEDZ Pepe AIRDROP</b> - HEDZ Pepe has been
                    Airdropped to owners of Matt Furie&apos;s HEDZ NFTs. Find us on Discord for
                    details!.
                  </li>
                </ol>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel3a-header"
            >
              <Typography style={{ fontFamily: 'Patrick Hand', fontSize: '1.5rem' }}>
                What is the mint price?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography style={{ fontFamily: 'Patrick Hand', fontSize: '1.5rem' }}>
                <ol>
                  <li style={{ marginBottom: '1rem' }}>
                    <b style={{ color: '#ff65e2' }}>ZOGZ Pepe Open Edition</b> - Price is 0.01234
                    ETH !
                  </li>
                  <li style={{ marginBottom: '1rem' }}>
                    <b style={{ color: '#ff65e2' }}>HEDZ Pepe AIRDROP</b> - FREE for HEDZ owners!
                    Find us on Discord for details!
                  </li>
                </ol>{' '}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel5a-header"
            >
              <Typography style={{ fontFamily: 'Patrick Hand', fontSize: '1.5rem' }}>
                I have more questions!
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography style={{ fontFamily: 'Patrick Hand', fontSize: '1.5rem' }}>
                Please visit us on DISCORD!
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </Container>
    </div>
  );
}
