"use client";

import Image from "next/image";
import { useState } from "react";
import { FileText, MessageSquare } from "lucide-react";
import { Comments } from "@/lib/comments/components/comments";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postByIdOptions } from "../api/queries/queries.client";
import notFound from "@/app/not-found";

export default function PostDetails({ postId }: { postId: number }) {
  const [activeTab, setActiveTab] = useState<"description" | "comments">(
    "description",
  );

  const { data } = useSuspenseQuery(postByIdOptions(postId));
  if (!data.ok) {
    notFound();
    return null;
  }
  const post = data.data;

  const tabs = [
    { id: "description", label: "Description", icon: FileText },
    {
      id: "comments",
      label: `Commentaires (${post.commentSize ?? 0})`,
      icon: MessageSquare,
    },
  ];
  return (
    <div className="flex flex-col max-h-[90vh] overflow-y-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 px-6 lg:px-10 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate">
            {post.title?.slice(0, 20) || "N/A"}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <span>ID: {post.id}</span>
            <span>•</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-t border-gray-200 dark:border-gray-700 pt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-all ${
                  isActive
                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div>
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Image Section */}
            <div className="lg:col-span-2">
              {post.imageUrl ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg mb-6">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-96 rounded-lg bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mb-6">
                  <span className="text-5xl font-bold text-gray-400 dark:text-gray-500">
                    {post.title?.slice(0, 5)?.toUpperCase() || "📄"}
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {post.description || "Pas de description disponible"}
                </p>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1">
              {/* Author Card */}
              {post.author && (
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-5 mb-6 border border-blue-100 dark:border-gray-600">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Auteur
                  </h3>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {post.author.firstName} {post.author.lastName}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                    J&apos;aime
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                    {post.likes}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                    Commentaires
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                    {post.commentSize ?? 0}
                  </p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="mt-6 space-y-2 text-sm">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Créé le
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {post.updatedAt && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Modifié le
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(post.updatedAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && <Comments queryParams={{ postId: post.id }} />}
      </div>
    </div>
  );
}
