import * as React from "react"
import { cn } from "../../lib/utils"

const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table ref={ref} className={cn("min-w-full text-sm", className)} {...props} />
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("", className)} {...props} />
  )
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("", className)} {...props} />
  )
)
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn("border-b", className)} {...props} />
  )
)
TableRow.displayName = "TableRow"

const TableCell = React.forwardRef<HTMLTableCellElement, React.HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-2", className)} {...props} />
  )
)
TableCell.displayName = "TableCell"

const TableHead = React.forwardRef<HTMLTableCellElement, React.HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn("p-2 text-left font-semibold", className)} {...props} />
  )
)
TableHead.displayName = "TableHead"

export { Table, TableHeader, TableBody, TableRow, TableCell, TableHead }
