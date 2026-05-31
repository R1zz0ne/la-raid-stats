---
name: devlog
description: "Creates DevLog documentation files for completed tasks, bug fixes, and significant code changes. Always applied when finishing work on a task."
category: documentation
risk: none
source: project
date_added: "2026-05-18"
alwaysApply: true
---

# DevLog Documentation Rule

## Overview

You are a DevLog documentation specialist. After completing any task, bug fix, or significant code change, you must create a documentation file summarizing the work done.

## When to Create DevLog

Always create a DevLog file when:
- Completing a feature implementation
- Fixing a bug (regardless of size)
- Making architectural changes
- Adding integrations
- Optimizing performance
- Any change that modifies application behavior

Do NOT create DevLog for:
- Minor typos or formatting fixes
- Documentation-only changes without code changes
- Refactoring without functional changes (unless major)

## DevLog File Format

### File Naming Convention

Format: `XXXX-short-description-of-changes.md`

- `XXXX` = 4-digit sequential number (0001, 0002, etc.)
- Description in lowercase, words separated by hyphens
- `.md` extension

**Correct examples:**
- `0001-multi-source-search-implementation.md`
- `0002-fix-authentication-bug.md`
- `0123-optimize-qdrant-queries.md`

**Incorrect examples:**
- `FIX-BUG.md` (wrong: uppercase, no index)
- `1-fix-bug.md` (wrong: index not 4 digits)
- `FIX_BUG.md` (wrong: underscores)

### Finding the Next Number

Before creating a new file:

1. List existing files in `docs/devlog/`
2. Find the file with the highest index number
3. Increment by 1
4. If directory is empty, start with `0001`

### DevLog File Structure

```markdown
# Brief Task Description

## 🎯 Проблема
Description of the problem or task...

## ✅ Решение
Description of the implemented solution...

## 📝 Изменённые файлы
1. path/to/file.py - what was changed
2. path/to/another/file.ts - what was changed

## 🚀 Как протестировать
Testing instructions...

## ⚙️ Важные детали
Additional implementation details...

## 🎉 Итог
Brief summary of the result...
```

## Workflow

### Step 1: Identify the Next Number

```bash
ls -1 docs/devlog/ | sort | tail -1
```

### Step 2: Create the DevLog File

Create the file with the appropriate name and structure.

### Step 3: Write Content

- Use Russian language in content (based on project language)
- Use emojis for visual structure: 🎯 ✅ 📝 🚀 ⚙️ 🎉
- Be concise but comprehensive

## Examples

### Example 1: Bug Fix
File: `docs/devlog/0001-fix-search-single-source-bug.md`
```markdown
# Исправление поиска только в одном источнике

## 🎯 Проблема
При поиске запрос отправлялся только в первый источник данных...

## ✅ Решение
Исправлена логика перебора источников в SearchService...

## 📝 Изменённые файлы
1. backend/services/search.py - исправлена логика итерации
2. tests/test_search.py - добавлен тест для мульти-source

## 🚀 Как протестировать
1. Запустить поиск с несколькими источниками
2. Проверить что результаты приходят из всех источников

## ⚙️ Важные детали
Поиск асинхронный, используется asyncio.gather...

## 🎉 Итог
Поиск теперь работает со всеми источниками корректно.
```

### Example 2: New Feature
File: `docs/devlog/0002-add-jira-integration.md`
```markdown
# Интеграция с Jira API

## 🎯 Проблема
Отсутствовала возможность получать задачи из Jira...

## ✅ Решение
Реализован JiraClient с поддержкой авторизации и получения задач...

## 📝 Изменённые файлы
1. backend/clients/jira.py - новый клиент
2. backend/api/v1/jira.py - API endpoints
3. docker-compose.yml - добавлен сервис Jira

## 🚀 Как протестировать
1. Настроить JIRA_URL, JIRA_TOKEN в .env
2. Вызвать GET /api/v1/jira/issues

## ⚙️ Важные детали
Токен передаётся через заголовок Authorization...

## 🎉 Итог
Jira интеграция готова к использованию.
```

## Validation Checklist

Before completing:

- [ ] File name follows format (4-digit index + lowercase description)
- [ ] All sections present (🎯 ✅ 📝 🚀 ⚙️ 🎉)
- [ ] Changed files listed with descriptions
- [ ] Testing instructions provided
- [ ] Content written in project's primary language

## Limitations

- Do not create DevLog for trivial changes
- Do not create DevLog for documentation-only changes
- File content should be factual and actionable
- Avoid speculative or uncertain statements