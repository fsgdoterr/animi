import { ReactNode } from "react";

type Align = "left" | "center" | "right";

export interface DataTableColumn<T> {
    id: string;
    header: ReactNode;
    accessorKey?: keyof T;
    cell?: (row: T, index: number) => ReactNode;
    align?: Align;
    width?: string;
    className?: string;
    headerClassName?: string;
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    getRowKey: (row: T, index: number) => string | number;

    isLoading?: boolean;
    loadingRows?: number;
    emptyText?: ReactNode;

    className?: string;
    tableClassName?: string;
    rowClassName?: string | ((row: T, index: number) => string);
}

const alignClasses: Record<Align, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function renderCell<T>(
    column: DataTableColumn<T>,
    row: T,
    index: number,
): ReactNode {
    if (column.cell) {
        return column.cell(row, index);
    }

    if (column.accessorKey) {
        return row[column.accessorKey] as ReactNode;
    }

    return null;
}

export function DataTable<T>({
    columns,
    data,
    getRowKey,

    isLoading = false,
    loadingRows = 5,
    emptyText = "Нічого не знайдено",

    className,
    tableClassName,
    rowClassName,
}: DataTableProps<T>) {
    const colSpan = Math.max(columns.length, 1);

    return (
        <div
            className={cn(
                "overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-1)]",
                className,
            )}
        >
            <div className="overflow-x-auto">
                <table
                    className={cn(
                        "w-full min-w-full border-collapse text-sm",
                        tableClassName,
                    )}
                >
                    <thead className="bg-[var(--bg-2)] text-[var(--text-2)]">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.id}
                                    style={{ width: column.width }}
                                    className={cn(
                                        "px-4 py-3 font-medium whitespace-nowrap",
                                        alignClasses[column.align ?? "left"],
                                        column.headerClassName,
                                    )}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[var(--border)]">
                        {data.map((row, index) => {
                            const computedRowClassName =
                                typeof rowClassName === "function"
                                    ? rowClassName(row, index)
                                    : rowClassName;

                            return (
                                <tr
                                    key={getRowKey(row, index)}
                                    className={cn(
                                        "transition hover:bg-[var(--bg-2)]",
                                        computedRowClassName,
                                    )}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.id}
                                            className={cn(
                                                "px-4 py-3 text-[var(--text-1)]",
                                                alignClasses[
                                                    column.align ?? "left"
                                                ],
                                                column.className,
                                            )}
                                        >
                                            {renderCell(column, row, index)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}

                        {!isLoading && data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={colSpan}
                                    className="px-4 py-10 text-center text-[var(--text-3)]"
                                >
                                    {emptyText}
                                </td>
                            </tr>
                        )}

                        {isLoading &&
                            Array.from({ length: loadingRows }).map(
                                (_, rowIndex) => (
                                    <tr key={`loading-${rowIndex}`}>
                                        {columns.map((column) => (
                                            <td
                                                key={column.id}
                                                className="px-4 py-3"
                                            >
                                                <div className="h-4 w-full animate-pulse rounded bg-[var(--bg-3)]" />
                                            </td>
                                        ))}
                                    </tr>
                                ),
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
