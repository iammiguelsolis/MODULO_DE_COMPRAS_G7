const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="text-sm text-gray-700 font-medium">{value}</div>
    </div>
);

export default InfoField;