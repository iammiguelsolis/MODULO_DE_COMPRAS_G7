import Button from "../atoms/Button";
import { UserPlus } from "lucide-react";

interface AddSupplierButtonProps {
    onClick?: () => void;
    fullWidth?: boolean;
}

export default function AddSupplierButton(props: AddSupplierButtonProps) {
    return (
        <Button
            variant="primary"
            icon={UserPlus}
            {...props}
        >
            Nuevo Proveedor
        </Button>
    );
}
