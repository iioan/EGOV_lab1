/**
 * Payments Report Document - Lab 2 eGovernment 2025
 * 
 * This component creates a professional PDF report using @react-pdf/renderer.
 * It includes multiple sections with statistics and charts.
 */

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { ReportData } from '@/lib/services/reportDataService';
import { ReportCharts } from '@/lib/services/chartsService';

// Register fonts (using default Helvetica for now, supports Romanian diacritics removal)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
});

// Styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  // Cover page styles
  coverPage: {
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 40,
  },
  coverDate: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 60,
  },
  coverUniversity: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginTop: 20,
  },
  // Header and footer styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#1E3A8A',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  headerDate: {
    fontSize: 9,
    color: '#6B7280',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
  },
  pageNumber: {
    fontSize: 8,
    color: '#6B7280',
  },
  // Section styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.5,
    marginBottom: 8,
    textAlign: 'justify',
  },
  highlightBox: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 4,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  highlightText: {
    fontSize: 11,
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 3,
  },
  statLabel: {
    fontSize: 10,
    color: '#4B5563',
  },
  statValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  // Chart styles
  chartContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  chartImage: {
    width: 400,
    height: 240,
    objectFit: 'contain',
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  chartHalf: {
    width: '48%',
    alignItems: 'center',
  },
  chartImageSmall: {
    width: 220,
    height: 150,
    objectFit: 'contain',
  },
  // Table styles
  table: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E3A8A',
    padding: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableRowAlt: {
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: '#374151',
  },
  // Overview card styles
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
    gap: 10,
  },
  overviewCard: {
    width: '30%',
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  overviewCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  overviewCardLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 5,
    textAlign: 'center',
  },
});

// Helper function to remove Romanian diacritics
function removeDiacritics(text: string): string {
  const diacriticsMap: Record<string, string> = {
    'ă': 'a', 'Ă': 'A',
    'â': 'a', 'Â': 'A',
    'î': 'i', 'Î': 'I',
    'ș': 's', 'Ș': 'S',
    'ț': 't', 'Ț': 'T',
  };
  return text.replace(/[ăĂâÂîÎșȘțȚ]/g, (match) => diacriticsMap[match] || match);
}

// Helper to format currency
function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ro-RO')} RON`;
}

// Helper to format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface PaymentsReportDocumentProps {
  data: ReportData;
  charts: ReportCharts;
}

/**
 * Cover Page Component
 */
const CoverPage: React.FC<{ generatedAt: string }> = ({ generatedAt }) => (
  <Page size="A4" style={styles.coverPage}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.coverTitle}>
        {removeDiacritics('Plată Taxe Universitate')}
      </Text>
      <Text style={styles.coverTitle}>
        Raport Statistic
      </Text>
      <Text style={styles.coverSubtitle}>
        Lab 2 - eGovernment 2025
      </Text>
      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          Raport generat automat din baza de date
        </Text>
      </View>
      <Text style={styles.coverUniversity}>
        Universitatea Politehnica Bucuresti
      </Text>
      <Text style={styles.coverDate}>
        Data generarii: {formatDate(generatedAt)}
      </Text>
    </View>
  </Page>
);

/**
 * Page Header Component
 */
const PageHeader: React.FC<{ title: string; date: string }> = ({ title, date }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
    <Text style={styles.headerDate}>{formatDate(date)}</Text>
  </View>
);

/**
 * Page Footer Component
 */
const PageFooter: React.FC = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>
      Raport Statistic - Lab 2 eGovernment 2025
    </Text>
    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
      `Pagina ${pageNumber} / ${totalPages}`
    )} />
  </View>
);

/**
 * Overview Section Component
 */
const OverviewSection: React.FC<{ data: ReportData }> = ({ data }) => (
  <View>
    <Text style={styles.sectionTitle}>1. Prezentare Generala</Text>
    
    <Text style={styles.paragraph}>
      Acest raport prezinta o analiza detaliata a platilor efectuate de studenti
      in sistemul de taxe universitare. Datele sunt agregate din baza de date si
      ofera o imagine de ansamblu asupra activitatii financiare.
    </Text>

    <View style={styles.overviewGrid}>
      <View style={styles.overviewCard}>
        <Text style={styles.overviewCardValue}>{data.totalPayments}</Text>
        <Text style={styles.overviewCardLabel}>Total Plati</Text>
      </View>
      <View style={styles.overviewCard}>
        <Text style={styles.overviewCardValue}>
          {formatCurrency(data.financialStats.totalAmount)}
        </Text>
        <Text style={styles.overviewCardLabel}>Suma Totala Colectata</Text>
      </View>
      <View style={styles.overviewCard}>
        <Text style={styles.overviewCardValue}>
          {formatCurrency(data.financialStats.averageAmount)}
        </Text>
        <Text style={styles.overviewCardLabel}>Medie per Plata</Text>
      </View>
    </View>

    <View style={styles.highlightBox}>
      <Text style={styles.highlightText}>
        Suma totala colectata: {formatCurrency(data.financialStats.totalAmount)}, 
        cu o medie de {formatCurrency(data.financialStats.averageAmount)} per plata.
      </Text>
    </View>
  </View>
);

/**
 * Program Analysis Section Component
 */
const ProgramSection: React.FC<{ data: ReportData; charts: ReportCharts }> = ({ data, charts }) => (
  <View>
    <Text style={styles.sectionTitle}>2. Analiza per Program de Studii</Text>
    
    <Text style={styles.paragraph}>
      Distributia platilor in functie de programul de studii (Licenta, Master, Doctorat)
      ofera informatii despre structura studentilor care efectueaza plati.
    </Text>

    {data.topProgram && (
      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          Programul cu cele mai multe plati: {removeDiacritics(data.topProgram.program)} 
          {' '}cu {data.topProgram.count} plati ({data.topProgram.percentage}% din total).
        </Text>
      </View>
    )}

    <View style={styles.subsectionTitle}>
      <Text>Distributie per Program</Text>
    </View>
    
    {data.programStats.map((stat, index) => (
      <View key={index} style={styles.statRow}>
        <Text style={styles.statLabel}>{removeDiacritics(stat.program)}</Text>
        <Text style={styles.statValue}>
          {stat.count} plati ({stat.percentage}%) - {formatCurrency(stat.totalAmount)}
        </Text>
      </View>
    ))}

    <View style={styles.chartRow}>
      <View style={styles.chartHalf}>
        <Image src={charts.programPieChart} style={styles.chartImageSmall} />
      </View>
      <View style={styles.chartHalf}>
        <Image src={charts.programBarChart} style={styles.chartImageSmall} />
      </View>
    </View>
  </View>
);

/**
 * Specialization Analysis Section Component
 */
const SpecializationSection: React.FC<{ data: ReportData; charts: ReportCharts }> = ({ data, charts }) => (
  <View>
    <Text style={styles.sectionTitle}>3. Analiza per Specializare</Text>
    
    <Text style={styles.paragraph}>
      Distributia platilor pe specializari indica care programe de studii genereaza
      cel mai mare volum de tranzactii.
    </Text>

    {data.topSpecialization && (
      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          Specializarea cu cele mai multe plati: {data.topSpecialization.specializare}
          {' '}cu {data.topSpecialization.count} plati.
        </Text>
      </View>
    )}

    <View style={styles.subsectionTitle}>
      <Text>Top 5 Specializari</Text>
    </View>

    {data.specializationStats.slice(0, 5).map((stat, index) => (
      <View key={index} style={index % 2 === 1 ? [styles.statRow, styles.tableRowAlt] : styles.statRow}>
        <Text style={styles.statLabel}>{index + 1}. {stat.specializare}</Text>
        <Text style={styles.statValue}>
          {stat.count} plati - {formatCurrency(stat.totalAmount)}
        </Text>
      </View>
    ))}

    <View style={styles.chartContainer}>
      <Image src={charts.specializationBarChart} style={styles.chartImage} />
    </View>
  </View>
);

/**
 * Payment Type Analysis Section Component
 */
const PaymentTypeSection: React.FC<{ data: ReportData; charts: ReportCharts }> = ({ data, charts }) => (
  <View>
    <Text style={styles.sectionTitle}>4. Analiza per Tip Plata</Text>
    
    <Text style={styles.paragraph}>
      Tipurile de plati (Taxa scolarizare, Refacere curs) indica motivele principale
      pentru care studentii efectueaza plati.
    </Text>

    {data.topPaymentType && (
      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          Cel mai frecvent tip de plata: {removeDiacritics(data.topPaymentType.tipPlata)}
          {' '}cu {data.topPaymentType.percentage}% din totalul platilor.
        </Text>
      </View>
    )}

    {data.highestRevenuePaymentType && (
      <Text style={styles.paragraph}>
        Tipul de plata care genereaza cel mai mult venit:{' '}
        {removeDiacritics(data.highestRevenuePaymentType.tipPlata)} cu{' '}
        {formatCurrency(data.highestRevenuePaymentType.totalAmount)}{' '}
        ({data.highestRevenuePaymentType.amountPercentage}% din suma totala).
      </Text>
    )}

    {data.paymentTypeStats.map((stat, index) => (
      <View key={index} style={styles.statRow}>
        <Text style={styles.statLabel}>{removeDiacritics(stat.tipPlata || 'Necunoscut')}</Text>
        <Text style={styles.statValue}>
          {stat.count} plati ({stat.percentage}%) - {formatCurrency(stat.totalAmount)}
        </Text>
      </View>
    ))}

    <View style={styles.chartRow}>
      <View style={styles.chartHalf}>
        <Image src={charts.paymentTypePieChart} style={styles.chartImageSmall} />
      </View>
      <View style={styles.chartHalf}>
        <Image src={charts.paymentTypeAmountBarChart} style={styles.chartImageSmall} />
      </View>
    </View>
  </View>
);

/**
 * Course Retakes Section Component
 */
const CourseRetakesSection: React.FC<{ data: ReportData; charts: ReportCharts }> = ({ data, charts }) => (
  <View>
    <Text style={styles.sectionTitle}>5. Analiza Refaceri Curs</Text>
    
    <Text style={styles.paragraph}>
      Aceasta sectiune analizeaza platile pentru refacerea cursurilor, evidentiind
      cursurile care genereaza cele mai multe plati de acest tip.
    </Text>

    {data.topCourses.length > 0 ? (
      <>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            Top 5 cursuri refacute: 1) {data.topCourses[0]?.courseName}
            {data.topCourses[1] && `, 2) ${data.topCourses[1].courseName}`}
            {data.topCourses[2] && `, 3) ${data.topCourses[2].courseName}`}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>#</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Curs</Text>
            <Text style={styles.tableHeaderCell}>Plati</Text>
            <Text style={styles.tableHeaderCell}>Suma</Text>
          </View>
          {data.topCourses.map((course, index) => (
            <View key={index} style={index % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{course.courseName}</Text>
              <Text style={styles.tableCell}>{course.count}</Text>
              <Text style={styles.tableCell}>{formatCurrency(course.totalAmount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartContainer}>
          <Image src={charts.topCoursesBarChart} style={styles.chartImage} />
        </View>
      </>
    ) : (
      <Text style={styles.paragraph}>
        Nu exista plati pentru refacere curs inregistrate.
      </Text>
    )}
  </View>
);

/**
 * Credits Analysis Section Component
 */
const CreditsSection: React.FC<{ data: ReportData; charts: ReportCharts }> = ({ data, charts }) => (
  <View>
    <Text style={styles.sectionTitle}>6. Analiza per Numar Credite</Text>
    
    <Text style={styles.paragraph}>
      Distributia platilor in functie de numarul de credite al cursurilor refacute.
    </Text>

    {data.topCreditValue && (
      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          Cele mai multe plati sunt pentru cursuri cu {data.topCreditValue.credits} credite
          ({data.topCreditValue.percentage}% din platile de refacere).
        </Text>
      </View>
    )}

    {data.creditStats.length > 0 ? (
      <>
        {data.creditStats.map((stat, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statLabel}>{stat.credits} credite</Text>
            <Text style={styles.statValue}>
              {stat.count} plati ({stat.percentage}%)
            </Text>
          </View>
        ))}

        <View style={styles.chartContainer}>
          <Image src={charts.creditsBarChart} style={styles.chartImage} />
        </View>
      </>
    ) : (
      <Text style={styles.paragraph}>
        Nu exista date despre numarul de credite.
      </Text>
    )}
  </View>
);

/**
 * Form of Education Section Component
 */
const FormaSection: React.FC<{ data: ReportData; charts: ReportCharts }> = ({ data, charts }) => (
  <View>
    <Text style={styles.sectionTitle}>7. Analiza Forma de Invatamant</Text>
    
    <Text style={styles.paragraph}>
      Comparatie intre studentii de la Buget si cei de la Taxa in functie de
      numarul de plati si sumele generate.
    </Text>

    {data.formaStats.map((stat, index) => (
      <View key={index} style={styles.statRow}>
        <Text style={styles.statLabel}>{removeDiacritics(stat.forma)}</Text>
        <Text style={styles.statValue}>
          {stat.count} plati ({stat.percentage}%) - {formatCurrency(stat.totalAmount)} ({stat.amountPercentage}%)
        </Text>
      </View>
    ))}

    {data.formaStats.length > 0 && (
      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          Studentii de la {removeDiacritics(data.formaStats[0].forma)} genereaza{' '}
          {data.formaStats[0].amountPercentage}% din suma totala colectata.
        </Text>
      </View>
    )}

    <View style={styles.chartRow}>
      <View style={styles.chartHalf}>
        <Image src={charts.formaBarChart} style={styles.chartImageSmall} />
      </View>
      <View style={styles.chartHalf}>
        <Image src={charts.formaPieChart} style={styles.chartImageSmall} />
      </View>
    </View>
  </View>
);

/**
 * Scholarship Type Section Component
 */
const ScholarshipSection: React.FC<{ data: ReportData; charts: ReportCharts }> = ({ data, charts }) => (
  <View>
    <Text style={styles.sectionTitle}>8. Analiza Regim Taxare</Text>
    
    <Text style={styles.paragraph}>
      Comparatie intre platile semestriale si cele anuale pentru taxa de scolarizare.
    </Text>

    {data.scholarshipStats.length > 0 ? (
      <>
        {data.scholarshipStats.map((stat, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statLabel}>{stat.type}</Text>
            <Text style={styles.statValue}>
              {stat.count} plati ({stat.percentage}%) - {formatCurrency(stat.totalAmount)}
            </Text>
          </View>
        ))}

        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            Platile {data.scholarshipStats[0]?.type.toLowerCase()} reprezinta{' '}
            {data.scholarshipStats[0]?.percentage}% din platile de scolarizare.
            Media pe plata: {formatCurrency(data.scholarshipStats[0]?.averageAmount || 0)}.
          </Text>
        </View>

        <View style={styles.chartRow}>
          <View style={styles.chartHalf}>
            <Image src={charts.scholarshipPieChart} style={styles.chartImageSmall} />
          </View>
          <View style={styles.chartHalf}>
            <Image src={charts.scholarshipBarChart} style={styles.chartImageSmall} />
          </View>
        </View>
      </>
    ) : (
      <Text style={styles.paragraph}>
        Nu exista date despre regimul de taxare.
      </Text>
    )}
  </View>
);

/**
 * Financial Analysis Section Component
 */
const FinancialSection: React.FC<{ data: ReportData; charts: ReportCharts }> = ({ data, charts }) => (
  <View>
    <Text style={styles.sectionTitle}>9. Analiza Financiara</Text>
    
    <Text style={styles.paragraph}>
      Statistici detaliate despre valorile platilor si distributia acestora.
    </Text>

    <View style={styles.highlightBox}>
      <Text style={styles.highlightText}>
        Suma totala colectata: {formatCurrency(data.financialStats.totalAmount)}.
        Media: {formatCurrency(data.financialStats.averageAmount)}.
        Min: {formatCurrency(data.financialStats.minAmount)}, Max: {formatCurrency(data.financialStats.maxAmount)}.
      </Text>
    </View>

    <View style={styles.subsectionTitle}>
      <Text>Distributie per Interval de Valoare</Text>
    </View>

    {data.financialStats.ranges.map((range, index) => (
      <View key={index} style={styles.statRow}>
        <Text style={styles.statLabel}>{range.range}</Text>
        <Text style={styles.statValue}>{range.count} plati</Text>
      </View>
    ))}

    <View style={styles.chartContainer}>
      <Image src={charts.financialRangesBarChart} style={styles.chartImage} />
    </View>
  </View>
);

/**
 * Time Analysis Section Component
 */
const TimeSection: React.FC<{ data: ReportData; charts: ReportCharts }> = ({ data, charts }) => (
  <View>
    <Text style={styles.sectionTitle}>10. Analiza Temporala</Text>
    
    <Text style={styles.paragraph}>
      Evolutia platilor in timp si distributia pe intervale orare.
    </Text>

    <View style={styles.highlightBox}>
      <Text style={styles.highlightText}>
        Cea mai activa zi: {data.timeStats.mostActiveDate}.
        Cel mai activ interval orar: {data.timeStats.mostActiveHour}.
      </Text>
    </View>

    <View style={styles.subsectionTitle}>
      <Text>Evolutie Plati in Timp</Text>
    </View>

    <View style={styles.chartContainer}>
      <Image src={charts.dailyPaymentsLineChart} style={styles.chartImage} />
    </View>

    <View style={styles.subsectionTitle}>
      <Text>Distributie pe Ore</Text>
    </View>

    <View style={styles.chartContainer}>
      <Image src={charts.hourlyDistributionBarChart} style={styles.chartImage} />
    </View>
  </View>
);

/**
 * Main Payments Report Document Component
 */
export const PaymentsReportDocument: React.FC<PaymentsReportDocumentProps> = ({ data, charts }) => (
  <Document>
    {/* Cover Page */}
    <CoverPage generatedAt={data.generatedAt} />

    {/* Overview and Program Analysis */}
    <Page size="A4" style={styles.page}>
      <PageHeader title="Raport Statistic - Plati Universitate" date={data.generatedAt} />
      <OverviewSection data={data} />
      <ProgramSection data={data} charts={charts} />
      <PageFooter />
    </Page>

    {/* Specialization and Payment Type Analysis */}
    <Page size="A4" style={styles.page}>
      <PageHeader title="Raport Statistic - Plati Universitate" date={data.generatedAt} />
      <SpecializationSection data={data} charts={charts} />
      <PaymentTypeSection data={data} charts={charts} />
      <PageFooter />
    </Page>

    {/* Course Retakes and Credits */}
    <Page size="A4" style={styles.page}>
      <PageHeader title="Raport Statistic - Plati Universitate" date={data.generatedAt} />
      <CourseRetakesSection data={data} charts={charts} />
      <CreditsSection data={data} charts={charts} />
      <PageFooter />
    </Page>

    {/* Form of Education and Scholarship Type */}
    <Page size="A4" style={styles.page}>
      <PageHeader title="Raport Statistic - Plati Universitate" date={data.generatedAt} />
      <FormaSection data={data} charts={charts} />
      <ScholarshipSection data={data} charts={charts} />
      <PageFooter />
    </Page>

    {/* Financial and Time Analysis */}
    <Page size="A4" style={styles.page}>
      <PageHeader title="Raport Statistic - Plati Universitate" date={data.generatedAt} />
      <FinancialSection data={data} charts={charts} />
      <TimeSection data={data} charts={charts} />
      <PageFooter />
    </Page>
  </Document>
);

export default PaymentsReportDocument;
