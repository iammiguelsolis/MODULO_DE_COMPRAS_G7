interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
    currentPage,
    totalPages,
    onPreviousPage,
    onNextPage
}) => {
    return (
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-300">
            <button
                onClick={onPreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
            >
                Anterior
            </button>

            <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
            </span>

            <button
                onClick={onNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
            >
                Siguiente
            </button>
        </div>
    );
};

export default TablePagination;