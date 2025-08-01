import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    // Show only 5 page numbers at a time
    const getVisiblePages = () => {
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + 4);
        
        // Adjust start if we're near the end
        if (end === totalPages) {
            start = Math.max(1, end - 4);
        }
        
        return pages.slice(start - 1, end);
    };

    return (
        <div className="flex items-center justify-center space-x-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {currentPage > 3 && (
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(1)}
                    >
                        1
                    </Button>
                    {currentPage > 4 && <span className="px-2">...</span>}
                </>
            )}
            
            {getVisiblePages().map(page => (
                <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))}
            
            {currentPage < totalPages - 2 && (
                <>
                    {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                    >
                        {totalPages}
                    </Button>
                </>
            )}
            
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
} 