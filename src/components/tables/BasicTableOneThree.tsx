"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";
import { MoreHorizontal, Eye, Pencil, Trash2, Copy } from "lucide-react";

// Importez vos modals préconfigurées
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Button } from "../ui/button";
import { PaginationControls } from "../ui/paginations";

interface Product {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

// Define the table data using the interface
const tableData: Product[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      role: "Project Manager",
    },
    projectName: "Technology",
    team: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    budget: "24.9K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
      role: "Content Writing",
    },
    projectName: "Blog Writing",
    team: {
      images: ["/images/user/user-27.jpg"],
    },
    budget: "12.7K",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      role: "Digital Marketer",
    },
    projectName: "Social Media",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    budget: "2.8K",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      role: "Front-end Developer",
    },
    projectName: "Website",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    budget: "4.5K",
    status: "Active",
  },
];

type StatusFilter = "All" | "Active" | "Pending" | "Cancel";

// Composant Pagination interne


export default function BasicTableThree() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Nombre d'items par page

  // Modals
  const viewModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const duplicateModal = useModal();

  // Filter products based on search query and status
  const filteredProducts = tableData.filter((product) => {
    const matchesSearch =
      product.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.projectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    document
      .getElementById("table-top")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExport = () => {
    console.log("Exporting data...");
    const csvContent = filteredProducts.map((product) => ({
      Name: product.user.name,
      Role: product.user.role,
      Project: product.projectName,
      Status: product.status,
      Budget: product.budget,
    }));
    console.log("Export data:", csvContent);
  };

  const handleAddProduct = () => {
    console.log("Add new product...");
  };

  // Action handlers
  const handleView = (product: Product) => {
    setSelectedProduct(product);
    viewModal.openModal();
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    editModal.openModal();
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    deleteModal.openModal();
  };

  const handleDuplicate = (product: Product) => {
    setSelectedProduct(product);
    duplicateModal.openModal();
  };

  const confirmDelete = () => {
    console.log("Deleting product:", selectedProduct);
    deleteModal.closeModal();
  };

  // Reset to first page when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Products List
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your store&apos;s progress to boost your sales.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </Button>

          <Button
            onClick={handleAddProduct}
            className="gap-2 bg-brand-500 hover:bg-brand-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Product
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
              {statusFilter !== "All" && (
                <span className="ml-1 rounded-full bg-brand-500 px-1.5 py-0.5 text-xs text-white">
                  {statusFilter}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleStatusFilterChange("All")}>
              <div className="flex items-center gap-2">
                {statusFilter === "All" && (
                  <svg
                    className="h-4 w-4 text-brand-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                All
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusFilterChange("Active")}
            >
              <div className="flex items-center gap-2">
                {statusFilter === "Active" && (
                  <svg
                    className="h-4 w-4 text-brand-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                Active
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusFilterChange("Pending")}
            >
              <div className="flex items-center gap-2">
                {statusFilter === "Pending" && (
                  <svg
                    className="h-4 w-4 text-brand-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                Pending
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusFilterChange("Cancel")}
            >
              <div className="flex items-center gap-2">
                {statusFilter === "Cancel" && (
                  <svg
                    className="h-4 w-4 text-brand-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                Cancel
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 dark:text-gray-400" id="table-top">
        Showing {startIndex + 1} to{" "}
        {Math.min(endIndex, filteredProducts.length)} of{" "}
        {filteredProducts.length} products
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    User
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Project Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Team
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Budget
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden rounded-full">
                            <Image
                              width={40}
                              height={40}
                              src={product.user.image}
                              alt={product.user.name}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {product.user.name}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {product.user.role}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {product.projectName}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex -space-x-2">
                          {product.team.images.map((teamImage, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                            >
                              <Image
                                width={24}
                                height={24}
                                src={teamImage}
                                alt={`Team member ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            product.status === "Active"
                              ? "success"
                              : product.status === "Pending"
                                ? "warning"
                                : "error"
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        ${product.budget}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleView(product)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(product)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit product
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(product)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 className="mr-2 h-4 w-4 text-error-500" />
                              <span className="text-error-500">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="h-12 w-12 text-gray-300 dark:text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p>No products found</p>
                        <p className="text-sm">
                          Try adjusting your search or filter
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* View Product Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={viewModal.closeModal}
        className="max-w-2xl p-6 lg:p-10"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full">
              <Image
                width={64}
                height={64}
                src={selectedProduct?.user.image || ""}
                alt={selectedProduct?.user.name || ""}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedProduct?.user.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {selectedProduct?.user.role}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Project Name
              </label>
              <p className="text-gray-900 dark:text-white">
                {selectedProduct?.projectName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Budget
              </label>
              <p className="text-gray-900 dark:text-white">
                ${selectedProduct?.budget}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </label>
              <div>
                <Badge
                  size="sm"
                  color={
                    selectedProduct?.status === "Active"
                      ? "success"
                      : selectedProduct?.status === "Pending"
                        ? "warning"
                        : "error"
                  }
                >
                  {selectedProduct?.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={viewModal.closeModal}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        className="max-w-md p-6 lg:p-10"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Product
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Edit product: {selectedProduct?.projectName}
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={editModal.closeModal}>
              Cancel
            </Button>
            <Button onClick={editModal.closeModal}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        className="max-w-md p-6 lg:p-10"
      >
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/20">
            <Trash2 className="h-6 w-6 text-error-600 dark:text-error-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Delete Product
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Are you sure you want to delete {selectedProduct?.projectName}? This
            action cannot be undone.
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" onClick={deleteModal.closeModal}>
              Cancel
            </Button>
            <Button
              className="bg-error-600 hover:bg-error-700"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Duplicate Modal */}
      <Modal
        isOpen={duplicateModal.isOpen}
        onClose={duplicateModal.closeModal}
        className="max-w-md p-6 lg:p-10"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Copy className="h-6 w-6 text-brand-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Duplicate Product
            </h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Are you sure you want to duplicate {selectedProduct?.projectName}?
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={duplicateModal.closeModal}>
              Cancel
            </Button>
            <Button onClick={duplicateModal.closeModal}>Duplicate</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
