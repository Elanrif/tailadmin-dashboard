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
      <div
        className="sticky top-0 z-20 bg-white dark:bg-gray-900 px-6 lg:px-10 pt-6 pb-4
       border-b border-gray-200 dark:border-gray-700"
      >
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate">
            {post.title?.slice(0, 20) || "N/A"}
          </h1>
          <div
            className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 
          flex-wrap"
          >
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
          <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column: Image + Description */}
              <div className="lg:col-span-2">
                {post.imageUrl ? (
                  <div className="relative w-full h-80 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-80 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-gray-300 dark:text-gray-600">
                      {post.title?.slice(0, 5)?.toUpperCase() || "📄"}
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {post.description || "Pas de description disponible"}
                  </p>
                </div>
              </div>

              {/* Right column: Author, Stats, Meta, Button */}
              <div className="lg:col-span-1 flex flex-col">
                {/* Author */}
                {post.author && (
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center font-semibold text-sm text-green-700 dark:text-green-400">
                      {post.author.firstName?.[0]}
                      {post.author.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {post.author.firstName} {post.author.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Auteur du cours
                      </p>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex border-t border-b border-gray-200 dark:border-gray-700 py-3 mb-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">♥</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {post.likes}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      J&apos;aime
                    </span>
                  </div>
                  <div className="w-px bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 flex flex-col gap-1 pl-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">💬</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {post.commentSize ?? 0}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Commentaires
                    </span>
                  </div>
                </div>

                {/* Meta info */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Créé le
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {post.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Modifié le
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(post.updatedAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Edit button */}
                <button className="mt-auto w-full flex items-center justify-center gap-2 bg-green-700
                 hover:bg-green-800 text-white font-medium text-sm py-2.5 rounded-lg transition-colors">
                  ✏️ Modifier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <Comments queryParams={{ postId: post.id }} />
        )}
      </div>
    </div>
  );
}
