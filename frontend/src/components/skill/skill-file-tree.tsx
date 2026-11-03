"use client";

import React, { useState } from "react";
import { Folder, FolderOpen, FileText, FileCode, FileJson, ChevronRight, ChevronDown } from "lucide-react";
import { SkillFile } from "@/types/skill";

interface TreeNode {
  name: string;
  path: string;
  isFile: boolean;
  file?: SkillFile;
  children?: Record<string, TreeNode>;
}

interface SkillFileTreeProps {
  files: SkillFile[];
  selectedPath: string;
  onSelectFile: (file: SkillFile) => void;
}

function buildTree(files: SkillFile[]): TreeNode {
  const root: TreeNode = {
    name: "root",
    path: "",
    isFile: false,
    children: {},
  };

  files.forEach((file) => {
    const parts = file.path.split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const currentPath = parts.slice(0, index + 1).join("/");

      if (!current.children) {
        current.children = {};
      }

      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          path: currentPath,
          isFile,
          file: isFile ? file : undefined,
          children: isFile ? undefined : {},
        };
      }
      current = current.children[part];
    });
  });

  return root;
}

function getFileIcon(filename: string) {
  if (filename === "SKILL.md") return <FileCode className="h-4 w-4 text-emerald-400" />;
  if (filename.endsWith(".md") || filename.endsWith(".txt")) return <FileText className="h-4 w-4 text-cyan-400" />;
  if (filename.endsWith(".json") || filename.endsWith(".yaml") || filename.endsWith(".yml")) return <FileJson className="h-4 w-4 text-amber-400" />;
  return <FileCode className="h-4 w-4 text-[#94A3B8]" />;
}

function TreeItem({
  node,
  selectedPath,
  onSelectFile,
  depth = 0,
}: {
  node: TreeNode;
  selectedPath: string;
  onSelectFile: (file: SkillFile) => void;
  depth?: number;
}) {
  const [isOpen, setIsOpen] = useState(true);

  if (node.isFile) {
    const isSelected = selectedPath === node.path;
    return (
      <button
        onClick={() => node.file && onSelectFile(node.file)}
        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] text-xs font-mono transition-colors text-left ${
          isSelected
            ? "bg-[#161B26] text-emerald-400 border border-[#1E2433] font-semibold"
            : "text-[#94A3B8] hover:bg-[#161B26]/60 hover:text-[#F8FAFC]"
        }`}
        style={{ paddingLeft: `${depth * 14 + 10}px` }}
      >
        {getFileIcon(node.name)}
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  const childrenKeys = Object.keys(node.children || {}).sort((a, b) => {
    const nodeA = node.children![a];
    const nodeB = node.children![b];
    if (nodeA.isFile === nodeB.isFile) return a.localeCompare(b);
    return nodeA.isFile ? 1 : -1;
  });

  return (
    <div className="space-y-0.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-[6px] text-xs font-mono text-[#94A3B8] hover:bg-[#161B26]/60 hover:text-[#F8FAFC] transition-colors text-left"
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {isOpen ? (
          <ChevronDown className="h-3 w-3 text-[#64748B]" />
        ) : (
          <ChevronRight className="h-3 w-3 text-[#64748B]" />
        )}
        {isOpen ? (
          <FolderOpen className="h-4 w-4 text-emerald-500/80" />
        ) : (
          <Folder className="h-4 w-4 text-emerald-500/80" />
        )}
        <span className="truncate font-semibold">{node.name}</span>
      </button>

      {isOpen && (
        <div className="space-y-0.5">
          {childrenKeys.map((key) => (
            <TreeItem
              key={node.children![key].path}
              node={node.children![key]}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SkillFileTree({ files, selectedPath, onSelectFile }: SkillFileTreeProps) {
  const root = buildTree(files);
  const childrenKeys = Object.keys(root.children || {}).sort((a, b) => {
    const nodeA = root.children![a];
    const nodeB = root.children![b];
    if (nodeA.isFile === nodeB.isFile) return a.localeCompare(b);
    return nodeA.isFile ? 1 : -1;
  });

  return (
    <div className="space-y-1 p-2">
      {childrenKeys.map((key) => (
        <TreeItem
          key={root.children![key].path}
          node={root.children![key]}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
          depth={0}
        />
      ))}
    </div>
  );
}
