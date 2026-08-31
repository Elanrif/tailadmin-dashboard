"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LIMIT_OPTIONS = [5, 10, 20, 50];

export function Filters({
  searchQuery,
  onSearchChange,
  authorId,
  onAuthorChange,
  authors,
  postId,
  onPostChange,
  posts,
  itemsPerPage,
  onLimitChange,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  authorId?: number;
  onAuthorChange: (value: string) => void;
  authors: { id: number; firstName: string; lastName: string }[];
  postId?: number;
  onPostChange: (value: string) => void;
  posts: { id: number; title: string }[];
  itemsPerPage: number;
  onLimitChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <Input
        className="w-full sm:max-w-xs"
        placeholder="Search comments..."
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <select
          aria-label="Filtrer par utilisateur"
          value={authorId ? String(authorId) : ""}
          onChange={(event) => onAuthorChange(event.target.value)}
          className="h-10 rounded-md border border-gray-300 bg-transparent px-3 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-gray-300"
        >
          <option value="">Tous les utilisateurs</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.firstName} {author.lastName}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrer par post"
          value={postId ? String(postId) : ""}
          onChange={(event) => onPostChange(event.target.value)}
          className="h-10 min-w-48 rounded-md border border-gray-300 bg-transparent px-3 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-gray-300"
        >
          <option value="">Tous les posts</option>
          {posts.map((post) => (
            <option key={post.id} value={post.id}>
              #{post.id} - {post.title}
            </option>
          ))}
        </select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
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
                  d="M4 6h16M4 12h10M4 18h7"
                />
              </svg>
              Limit{" "}
              <span className="ml-1 rounded-full bg-brand-500 px-1.5 py-0.5 text-xs text-white">
                {itemsPerPage}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={String(itemsPerPage)}
              onValueChange={onLimitChange}
            >
              {LIMIT_OPTIONS.map((limit) => (
                <DropdownMenuRadioItem key={limit} value={String(limit)}>
                  {limit}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
