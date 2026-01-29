interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle = ({ children }: SectionTitleProps) => {
  return (
    <h3 className="simulator-section-title mb-4">
      {children}
    </h3>
  );
};

export default SectionTitle;
