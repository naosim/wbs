import { TitleOnlyTask, ManagedTask } from './domain/task';
import { TaskSummaryRepository, Links, DateInTask } from './domain/TaskSummary';
import { TaskId } from './domain/TaskId';
import { Note, TaskNoteRepository } from './domain/TaskNote';
import { TaskTreeRepository } from './domain/TaskTree';
import { TaskListFactory } from './service/TaskListFactory';
import { TitleOnlyToMangedService } from './service/TitleOnlyToMangedService';
import { UpdateNoteBodyService } from './service/UpdateNoteBodyService';
import { CreateEmptyNoteService } from './service/CreateEmptyNoteService';

import { EditingText } from "./EditingText";
import { Services } from "./Services";
import { DateInTaskFactory, LinksFactory, ToMarkdown, MilestoneFactory } from './infra/text/markdown';
import { Config } from './Config';
declare var window;
export class View {
  static setup(taskSummaryRepository: TaskSummaryRepository, taskNoteRepository: TaskNoteRepository, taskTreeRepository: TaskTreeRepository, now: Date, config: Config) {
    var taskListFactory = new TaskListFactory(taskSummaryRepository, taskNoteRepository, taskTreeRepository, now);
    // var tasks = taskListFactory.create().map(v => {
    //   if (!v.isManaged) {
    //     return v;
    //   }
    //   v = v as ManagedTask;
    //   var obj = v as any; // vue用に変更
    //   obj.editingMilestonesText = v.summary.milestones.list.map(v => `${v.dateText} ${v.title}`).join('\n');
    //   (v as any).isEditingMilestones = false;
    //   return obj;
    // });
    var callbackToReload = (err?) => {
      if (err)
        throw err;
      app.reload();
    };
    var services = new Services(new TitleOnlyToMangedService(taskSummaryRepository, taskTreeRepository), new UpdateNoteBodyService(taskNoteRepository), new CreateEmptyNoteService(taskNoteRepository, now));
    var app = new window.Vue({
      el: '#app',
      data: {
        message: 'Hello Vue!',
        list: [] /*tasks*/,
        rootBody: '' /*taskTreeRepository.getTaskRootBody()*/,
        filter: '',
        owner: config.owner,
        repo: config.repo,
        issueUrlPrefix: `https://github.com/${config.owner}/${config.repo}/issues`,
        filterCheckbox: {
          'title': { label: '件名', checked: true },
          'assgin': { label: '担当', checked: true },
          'body': { label: '内容', checked: true },
          'milestone': { label: 'マイルストーン', checked: true },
          'latestnote': { label: '最新状況', checked: true }
        },
        selectedFilter: 'フィルタなし',
        selectedSecondFilter: 'フィルタなし',
        toMarkdown: new ToMarkdown(),
      },
      computed: {
        decoratedList: function () {
          console.log('decoratedList');
          var result = this.list;
          var fitlerTargetMap = {
            'title': v => v.title.indexOf(this.filter) != -1,
            'assgin': v => v.isManaged && v.summary.assign.indexOf(this.filter) != -1,
            'body': v => v.isManaged && v.summary.description.indexOf(this.filter) != -1,
            'milestone': v => v.isManaged && v.summary.milestones.contains(this.filter),
            'latestnote': v => v.isManaged && v.latestNoteText.indexOf(this.filter) != -1
          };
          result = result.map(v => {
            v.isHilight = false;
            if (this.filter.trim().length == 0) {
              v.isHilight = false;
            }
            else if (Object.keys(fitlerTargetMap).filter(key => this.filterCheckbox[key].checked).some(key => fitlerTargetMap[key](v))) {
              v.isHilight = true;
            }
            v.isEditingMilestones = false;
            return v;
          });
          return result;
        },
        filteredList: function() {
          var list = this.decoratedList;
          if(this.selectedFilter == 'フィルタなし') {
            return list;
          }
          return View.filter(list, 'nest0', this.selectedFilter)
        },
        filteredSecondList: function() {
          var list = this.filteredList;
          if(this.selectedSecondFilter == 'フィルタなし') {
            return list;
          }
          return View.filter(list, 'nest1', this.selectedSecondFilter)
        }
      },
      methods: {
        reload: function () {
          this.list = taskListFactory.create().map(v => {
            if (!v.isManaged) {
              return v;
            }
            v = v as ManagedTask;
            var obj = v as any; // vue用に変更
            var editingText: EditingText = {
              milestones: v.summary.milestones.list.map(v => `${v.dateText} ${v.title}`).join('\n'),
              isEditingMilestones: false,
              assign: v.summary.assign,
              isEditingAssign: false,
              goal: v.summary.goal,
              isEditingGoal: false,
              completeDateText: v.summary.completeDate ? v.summary.completeDate.text : '',
              isEditingCompleteDateText: false,
              linksText: v.summary.links.text,
              isEditingLinksText: false,
              description: v.summary.description,
              isEditingDescription: false,
            };
            obj.editingText = editingText;
            return obj;
          });
          console.log(this.list.filter(v => v.nest == 'nest0'));
          this.rootBody = taskTreeRepository.getTaskRootBody();
        },
        onPressedRootBodyEdit: function () {
          taskTreeRepository.updateTaskRootBody(this.rootBody, callbackToReload);
        },
        br(text) {
          return text.split('\n').join('<br>');
        },
        createTask(titleOnlyTask: TitleOnlyTask) {
          services.titleOnlyToMangedService.convert(titleOnlyTask, callbackToReload);
        },
        editNote(note: Note, selector) {
          var body = document.querySelector(selector).value.trim();
          services.updateNoteBodyService.update(note, body, callbackToReload);
        },
        createNote(taskId: TaskId) {
          services.createEmptyNoteService.create(taskId, callbackToReload);
        },
        updateSummary(obj) {
          console.log(obj);
          var editingText: EditingText = obj.editingText;
          var summary = taskSummaryRepository
            .getSummary(obj.taskId as TaskId, now)
            .updateMilestones(MilestoneFactory.createMilestones(editingText.milestones, now))
            .updateAssign(editingText.assign)
            .updateGoal(editingText.goal)
            .updateCompleteDate(DateInTaskFactory.create(editingText.completeDateText, now))
            .updateLinks(LinksFactory.create(editingText.linksText))
            .updateDescription(editingText.description);
          taskSummaryRepository.update(summary, callbackToReload);
        }
      }
    });
    app.reload();
  }

  static filter(list, nest, title) {
    var convertToNestNum = (nest) => parseInt(nest.split('nest')[1]);
    var targetNestNum = convertToNestNum(nest);
    var isStart = false;
    var isEnd = false;
    return list.filter(task => {
      var nestNum = convertToNestNum(task.nest);
      if(!isStart) {
        if(nestNum < targetNestNum) {
          return true;
        }
        if(task.title == title) {
          isStart = true;
          return true;
        }
        return false;
      } else if(isStart && !isEnd) {
        if(task.nest != nest) {
          return true;
        }
        isEnd = true;
        return false;
  
      } else if(isEnd) {
        return false;
      }
    })
    
  }
}
