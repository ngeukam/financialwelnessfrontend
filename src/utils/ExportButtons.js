import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PictureAsPdf, Image } from '@mui/icons-material';
import { Button, Box, CircularProgress } from '@mui/material';
import { useState } from 'react';

const ExportButtons = ({ tabRefs, activeTab }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Validates and waits for DOM elements
  const ensureElementReady = async (ref) => {
    let retries = 0;
    while (retries < 5) {
      if (ref?.current) return ref.current;
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }
    throw new Error('Element not found after retries');
  };

  const captureTab = async (ref) => {
    try {
      const element = await ensureElementReady(ref);
      const originalStyle = {
        visibility: element.style.visibility,
        position: element.style.position
      };

      // Prepare element for capture
      element.style.visibility = 'visible';
      element.style.position = 'absolute';

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Force visibility of all child elements
          clonedDoc.querySelectorAll('*').forEach(el => {
            el.style.visibility = 'visible';
          });
        }
      });

      // Restore original styles
      element.style.visibility = originalStyle.visibility;
      element.style.position = originalStyle.position;

      return canvas;
    } catch (error) {
      console.error('Capture failed:', error);
      throw new Error(`Failed to capture tab: ${error.message}`);
    }
  };

  const exportCurrentPNG = async () => {
    setIsExporting(true);
    try {
      const currentRef = tabRefs[activeTab - 1];
      const canvas = await captureTab(currentRef);
      const link = document.createElement('a');
      link.download = `financial_${activeTab === 1 ? 'ratios' : 'zscore'}_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      alert(`PNG Export Error: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    setIsExportingPdf(true);
    try {
      if (!tabRefs || !Array.isArray(tabRefs)) {
        throw new Error('Invalid tab references');
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 10;
      const pageWidth = pdf.internal.pageSize.getWidth() - 2 * margin;

      for (let i = 0; i < tabRefs.length; i++) {
        try {
          // Switch to the tab before capturing
          // setActiveTab(i + 1);
          // Wait for the tab to render
          // await new Promise(resolve => setTimeout(resolve, 500));

          const canvas = await captureTab(tabRefs[i]);
          const pageHeight = pdf.internal.pageSize.getHeight() - 2 * margin;
          const ratio = Math.min(
            pageWidth / canvas.width,
            pageHeight / canvas.height
          );

          // if (i > 0) pdf.addPage();
          pdf.addImage(
            canvas,
            'PNG',
            margin,
            margin,
            canvas.width * ratio,
            canvas.height * ratio
          );
        } catch (tabError) {
          console.error(`Failed to capture tab ${i + 1}:`, tabError);
          continue;
        }
      }

      pdf.save(`financial_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert(`PDF Export Error: ${error.message}`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <Box sx={{ mt: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
      <Button
        variant="outlined"
        startIcon={isExporting ? <CircularProgress size={20} /> : <Image />}
        onClick={exportCurrentPNG}
        disabled={isExporting}
        sx={{ textTransform: 'none' }}
      >
        {isExporting ? 'Exporting...' : 'Export Image'}
      </Button>

      <Button
        variant="contained"
        startIcon={isExportingPdf ? <CircularProgress size={20} /> : <PictureAsPdf />}
        onClick={exportToPDF}
        disabled={isExportingPdf}
        sx={{ textTransform: 'none' }}
      >
        {isExportingPdf ? 'Exporting...' : 'Export PDF'}
      </Button>
    </Box>
  );
};

export default ExportButtons;