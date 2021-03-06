'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcTable = require('rc-table');

var _rcTable2 = _interopRequireDefault(_rcTable);

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _radio = require('../radio');

var _radio2 = _interopRequireDefault(_radio);

var _filterDropdown = require('./filterDropdown');

var _filterDropdown2 = _interopRequireDefault(_filterDropdown);

var _pagination = require('../pagination');

var _pagination2 = _interopRequireDefault(_pagination);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _spin = require('../spin');

var _spin2 = _interopRequireDefault(_spin);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function noop() {}

function stopPropagation(e) {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
}

var defaultLocale = {
  filterTitle: '筛选',
  filterConfirm: '确定',
  filterReset: '重置',
  emptyText: _react2.default.createElement(
    'span',
    null,
    _react2.default.createElement(_icon2.default, { type: 'frown' }),
    '\u6682\u65E0\u6570\u636E'
  )
};

var defaultPagination = {
  pageSize: 10,
  onChange: noop,
  onShowSizeChange: noop
};

var Table = function (_React$Component) {
  _inherits(Table, _React$Component);

  function Table(props) {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, props));

    _initialiseProps.call(_this);

    var pagination = props.pagination || {};

    _this.state = _extends({
      // 减少状态
      selectedRowKeys: (props.rowSelection || {}).selectedRowKeys || [],
      filters: _this.getFiltersFromColumns(),
      selectionDirty: false
    }, _this.getSortStateFromColumns(), {
      pagination: _this.hasPagination() ? _extends({}, defaultPagination, pagination, {
        current: pagination.defaultCurrent || pagination.current || 1
      }) : {}
    });

    _this.CheckboxPropsCache = {};
    return _this;
  }

  _createClass(Table, [{
    key: 'getCheckboxPropsByItem',
    value: function getCheckboxPropsByItem(item) {
      var _props$rowSelection = this.props.rowSelection,
          rowSelection = _props$rowSelection === undefined ? {} : _props$rowSelection;

      if (!rowSelection.getCheckboxProps) {
        return {};
      }
      var key = this.getRecordKey(item);
      // Cache checkboxProps
      if (!this.CheckboxPropsCache[key]) {
        this.CheckboxPropsCache[key] = rowSelection.getCheckboxProps(item);
      }
      return this.CheckboxPropsCache[key];
    }
  }, {
    key: 'getDefaultSelection',
    value: function getDefaultSelection() {
      var _this2 = this;

      var _props$rowSelection2 = this.props.rowSelection,
          rowSelection = _props$rowSelection2 === undefined ? {} : _props$rowSelection2;

      if (!rowSelection.getCheckboxProps) {
        return [];
      }
      return this.getFlatCurrentPageData().filter(function (item) {
        return _this2.getCheckboxPropsByItem(item).defaultChecked;
      }).map(function (record, rowIndex) {
        return _this2.getRecordKey(record, rowIndex);
      });
    }
  }, {
    key: 'getLocale',
    value: function getLocale() {
      var locale = {};
      if (this.context.antLocale && this.context.antLocale.Table) {
        locale = this.context.antLocale.Table;
      }
      return _extends({}, defaultLocale, locale, this.props.locale);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if ('pagination' in nextProps && nextProps.pagination !== false) {
        this.setState(function (previousState) {
          var newPagination = _extends({}, defaultPagination, previousState.pagination, nextProps.pagination);
          newPagination.current = newPagination.current || 1;
          return { pagination: newPagination };
        });
      }
      // dataSource 的变化会清空选中项
      if ('dataSource' in nextProps && nextProps.dataSource !== this.props.dataSource) {
        this.setState({
          selectionDirty: false
        });
        this.CheckboxPropsCache = {};
      }
      if (nextProps.rowSelection && 'selectedRowKeys' in nextProps.rowSelection) {
        this.setState({
          selectedRowKeys: nextProps.rowSelection.selectedRowKeys || []
        });
        if (nextProps.rowSelection.getCheckboxProps !== this.props.rowSelection.getCheckboxProps) {
          this.CheckboxPropsCache = {};
        }
      }

      if (this.getSortOrderColumns(nextProps.columns).length > 0) {
        var sortState = this.getSortStateFromColumns(nextProps.columns);
        if (sortState.sortColumn !== this.state.sortColumn || sortState.sortOrder !== this.state.sortOrder) {
          this.setState(sortState);
        }
      }

      var filteredValueColumns = this.getFilteredValueColumns(nextProps.columns);
      if (filteredValueColumns.length > 0) {
        var filtersFromColumns = this.getFiltersFromColumns(nextProps.columns);
        var newFilters = _extends({}, this.state.filters);
        Object.keys(filtersFromColumns).forEach(function (key) {
          newFilters[key] = filtersFromColumns[key];
        });
        if (this.isFiltersChanged(newFilters)) {
          this.setState({ filters: newFilters });
        }
      }
    }
  }, {
    key: 'setSelectedRowKeys',
    value: function setSelectedRowKeys(selectedRowKeys) {
      var _this3 = this;

      if (this.props.rowSelection && !('selectedRowKeys' in this.props.rowSelection)) {
        this.setState({ selectedRowKeys: selectedRowKeys });
      }
      if (this.props.rowSelection && this.props.rowSelection.onChange) {
        var data = this.getFlatCurrentPageData();
        var selectedRows = data.filter(function (row, i) {
          return selectedRowKeys.indexOf(_this3.getRecordKey(row, i)) >= 0;
        });
        this.props.rowSelection.onChange(selectedRowKeys, selectedRows);
      }
    }
  }, {
    key: 'hasPagination',
    value: function hasPagination() {
      return this.props.pagination !== false;
    }
  }, {
    key: 'isFiltersChanged',
    value: function isFiltersChanged(filters) {
      var _this4 = this;

      var filtersChanged = false;
      if (Object.keys(filters).length !== Object.keys(this.state.filters).length) {
        filtersChanged = true;
      } else {
        Object.keys(filters).forEach(function (columnKey) {
          if (filters[columnKey] !== _this4.state.filters[columnKey]) {
            filtersChanged = true;
          }
        });
      }
      return filtersChanged;
    }
  }, {
    key: 'getSortOrderColumns',
    value: function getSortOrderColumns(columns) {
      return (columns || this.props.columns || []).filter(function (column) {
        return 'sortOrder' in column;
      });
    }
  }, {
    key: 'getFilteredValueColumns',
    value: function getFilteredValueColumns(columns) {
      return (columns || this.props.columns || []).filter(function (column) {
        return 'filteredValue' in column;
      });
    }
  }, {
    key: 'getFiltersFromColumns',
    value: function getFiltersFromColumns(columns) {
      var _this5 = this;

      var filters = {};
      this.getFilteredValueColumns(columns).forEach(function (col) {
        filters[_this5.getColumnKey(col)] = col.filteredValue;
      });
      return filters;
    }
  }, {
    key: 'getSortStateFromColumns',
    value: function getSortStateFromColumns(columns) {
      // return fisrt column which sortOrder is not falsy
      var sortedColumn = this.getSortOrderColumns(columns).filter(function (col) {
        return col.sortOrder;
      })[0];
      if (sortedColumn) {
        return {
          sortColumn: sortedColumn,
          sortOrder: sortedColumn.sortOrder
        };
      }
      return {
        sortColumn: null,
        sortOrder: null
      };
    }
  }, {
    key: 'getSorterFn',
    value: function getSorterFn() {
      var _state = this.state,
          sortOrder = _state.sortOrder,
          sortColumn = _state.sortColumn;

      if (!sortOrder || !sortColumn || typeof sortColumn.sorter !== 'function') {
        return;
      }
      return function (a, b) {
        var result = sortColumn.sorter(a, b);
        if (result !== 0) {
          return sortOrder === 'descend' ? -result : result;
        }
        return a.indexForSort - b.indexForSort;
      };
    }
  }, {
    key: 'toggleSortOrder',
    value: function toggleSortOrder(order, column) {
      var _props;

      var _state2 = this.state,
          sortColumn = _state2.sortColumn,
          sortOrder = _state2.sortOrder;
      // 只同时允许一列进行排序，否则会导致排序顺序的逻辑问题

      var isSortColumn = this.isSortColumn(column);
      if (!isSortColumn) {
        // 当前列未排序
        sortOrder = order;
        sortColumn = column;
      } else {
        // 当前列已排序
        if (sortOrder === order) {
          // 切换为未排序状态
          sortOrder = '';
          sortColumn = null;
        } else {
          // 切换为排序状态
          sortOrder = order;
        }
      }
      var newState = {
        sortOrder: sortOrder,
        sortColumn: sortColumn
      };

      // Controlled
      if (this.getSortOrderColumns().length === 0) {
        this.setState(newState);
      }

      (_props = this.props).onChange.apply(_props, _toConsumableArray(this.prepareParamsArguments(_extends({}, this.state, newState))));
    }
  }, {
    key: 'getRecordKey',
    value: function getRecordKey(record, index) {
      if (this.props.rowKey) {
        return this.props.rowKey(record, index);
      }
      return record.key || index;
    }
  }, {
    key: 'renderRowSelection',
    value: function renderRowSelection() {
      var _this6 = this;

      var columns = this.props.columns.concat();
      if (this.props.rowSelection) {
        var data = this.getFlatCurrentPageData().filter(function (item) {
          if (_this6.props.rowSelection.getCheckboxProps) {
            return !_this6.getCheckboxPropsByItem(item).disabled;
          }
          return true;
        });
        var checked = void 0;
        if (!data.length) {
          checked = false;
        } else {
          checked = this.state.selectionDirty ? data.every(function (item, i) {
            return _this6.state.selectedRowKeys.indexOf(_this6.getRecordKey(item, i)) >= 0;
          }) : data.every(function (item, i) {
            return _this6.state.selectedRowKeys.indexOf(_this6.getRecordKey(item, i)) >= 0;
          }) || data.every(function (item) {
            return _this6.getCheckboxPropsByItem(item).defaultChecked;
          });
        }
        var selectionColumn = void 0;
        if (this.props.rowSelection.type === 'radio') {
          selectionColumn = {
            key: 'selection-column',
            render: this.renderSelectionRadio,
            className: 'ant-table-selection-column'
          };
        } else {
          var checkboxAllDisabled = data.every(function (item) {
            return _this6.getCheckboxPropsByItem(item).disabled;
          });
          var checkboxAll = _react2.default.createElement(_checkbox2.default, { checked: checked,
            disabled: checkboxAllDisabled,
            onChange: this.handleSelectAllRow
          });
          selectionColumn = {
            key: 'selection-column',
            title: checkboxAll,
            render: this.renderSelectionCheckBox,
            className: 'ant-table-selection-column'
          };
        }
        if (columns.some(function (column) {
          return column.fixed === 'left' || column.fixed === true;
        })) {
          selectionColumn.fixed = 'left';
        }
        if (columns[0] && columns[0].key === 'selection-column') {
          columns[0] = selectionColumn;
        } else {
          columns.unshift(selectionColumn);
        }
      }
      return columns;
    }
  }, {
    key: 'getColumnKey',
    value: function getColumnKey(column, index) {
      return column.key || column.dataIndex || index;
    }
  }, {
    key: 'isSortColumn',
    value: function isSortColumn(column) {
      var sortColumn = this.state.sortColumn;

      if (!column || !sortColumn) {
        return false;
      }
      return this.getColumnKey(sortColumn) === this.getColumnKey(column);
    }
  }, {
    key: 'renderColumnsDropdown',
    value: function renderColumnsDropdown(columns) {
      var _this7 = this;

      var sortOrder = this.state.sortOrder;

      var locale = this.getLocale();
      return columns.map(function (originColumn, i) {
        var column = _extends({}, originColumn);
        var key = _this7.getColumnKey(column, i);
        var filterDropdown = void 0;
        var sortButton = void 0;
        if (column.filters && column.filters.length > 0 || column.filterDropdown) {
          var colFilters = _this7.state.filters[key] || [];
          filterDropdown = _react2.default.createElement(_filterDropdown2.default, {
            locale: locale,
            column: column,
            selectedKeys: colFilters,
            confirmFilter: _this7.handleFilter
          });
        }
        if (column.sorter) {
          var isSortColumn = _this7.isSortColumn(column);
          if (isSortColumn) {
            column.className = column.className || '';
            if (sortOrder) {
              column.className += ' ant-table-column-sort';
            }
          }
          var isAscend = isSortColumn && sortOrder === 'ascend';
          var isDescend = isSortColumn && sortOrder === 'descend';
          sortButton = _react2.default.createElement(
            'div',
            { className: 'ant-table-column-sorter' },
            _react2.default.createElement(
              'span',
              { className: 'ant-table-column-sorter-up ' + (isAscend ? 'on' : 'off'),
                title: '\u2191',
                onClick: function onClick() {
                  return _this7.toggleSortOrder('ascend', column);
                }
              },
              _react2.default.createElement(_icon2.default, { type: 'caret-up' })
            ),
            _react2.default.createElement(
              'span',
              { className: 'ant-table-column-sorter-down ' + (isDescend ? 'on' : 'off'),
                title: '\u2193',
                onClick: function onClick() {
                  return _this7.toggleSortOrder('descend', column);
                }
              },
              _react2.default.createElement(_icon2.default, { type: 'caret-down' })
            )
          );
        }
        column.title = _react2.default.createElement(
          'span',
          null,
          column.title,
          sortButton,
          filterDropdown
        );
        return column;
      });
    }
  }, {
    key: 'renderPagination',
    value: function renderPagination() {
      // 强制不需要分页
      if (!this.hasPagination()) {
        return null;
      }
      var size = 'default';
      if (this.state.pagination.size) {
        size = this.state.pagination.size;
      } else if (this.props.size === 'middle' || this.props.size === 'small') {
        size = 'small';
      }
      var total = this.state.pagination.total || this.getLocalData().length;
      return total > 0 ? _react2.default.createElement(_pagination2.default, _extends({}, this.state.pagination, {
        className: this.props.prefixCls + '-pagination',
        onChange: this.handlePageChange,
        total: total,
        size: size,
        onShowSizeChange: this.handleShowSizeChange
      })) : null;
    }
  }, {
    key: 'prepareParamsArguments',
    value: function prepareParamsArguments(state) {
      // 准备筛选、排序、分页的参数
      var pagination = state.pagination;
      var filters = state.filters;
      var sorter = {};
      if (state.sortColumn && state.sortOrder) {
        sorter.column = state.sortColumn;
        sorter.order = state.sortOrder;
        sorter.field = state.sortColumn.dataIndex;
        sorter.columnKey = this.getColumnKey(state.sortColumn);
      }
      return [pagination, filters, sorter];
    }
  }, {
    key: 'findColumn',
    value: function findColumn(myKey) {
      var _this8 = this;

      return this.props.columns.filter(function (c) {
        return _this8.getColumnKey(c) === myKey;
      })[0];
    }
  }, {
    key: 'getCurrentPageData',
    value: function getCurrentPageData() {
      var data = this.getLocalData();
      var current = void 0;
      var pageSize = void 0;
      var state = this.state;
      // 如果没有分页的话，默认全部展示
      if (!this.hasPagination()) {
        pageSize = Number.MAX_VALUE;
        current = 1;
      } else {
        pageSize = state.pagination.pageSize;
        current = state.pagination.current;
      }
      // 分页
      // ---
      // 当数据量少于等于每页数量时，直接设置数据
      // 否则进行读取分页数据
      if (data.length > pageSize || pageSize === Number.MAX_VALUE) {
        data = data.filter(function (item, i) {
          return i >= (current - 1) * pageSize && i < current * pageSize;
        });
      }
      return data;
    }
  }, {
    key: 'getFlatCurrentPageData',
    value: function getFlatCurrentPageData() {
      return (0, _util.flatArray)(this.getCurrentPageData());
    }
  }, {
    key: 'getLocalData',
    value: function getLocalData() {
      var _this9 = this;

      var state = this.state;
      var data = this.props.dataSource || [];
      // 优化本地排序
      data = data.slice(0);
      for (var i = 0; i < data.length; i++) {
        data[i].indexForSort = i;
      }
      var sorterFn = this.getSorterFn();
      if (sorterFn) {
        data = data.sort(sorterFn);
      }
      // 筛选
      if (state.filters) {
        Object.keys(state.filters).forEach(function (columnKey) {
          var col = _this9.findColumn(columnKey);
          if (!col) {
            return;
          }
          var values = state.filters[columnKey] || [];
          if (values.length === 0) {
            return;
          }
          data = col.onFilter ? data.filter(function (record) {
            return values.some(function (v) {
              return col.onFilter(v, record);
            });
          }) : data;
        });
      }
      return data;
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames,
          _this10 = this;

      var _props2 = this.props,
          style = _props2.style,
          className = _props2.className,
          restProps = _objectWithoutProperties(_props2, ['style', 'className']);

      var data = this.getCurrentPageData();
      var columns = this.renderRowSelection();
      var expandIconAsCell = this.props.expandedRowRender && this.props.expandIconAsCell !== false;
      var locale = this.getLocale();

      var classString = (0, _classnames2.default)((_classNames = {}, _defineProperty(_classNames, 'ant-table-' + this.props.size, true), _defineProperty(_classNames, 'ant-table-bordered', this.props.bordered), _classNames));

      columns = this.renderColumnsDropdown(columns);
      columns = columns.map(function (column, i) {
        var newColumn = _extends({}, column);
        newColumn.key = _this10.getColumnKey(newColumn, i);
        return newColumn;
      });
      var emptyText = void 0;
      var emptyClass = '';
      if (!data || data.length === 0) {
        emptyText = _react2.default.createElement('div', { className: 'ant-table-placeholder' });
        emptyClass = 'ant-table-empty';
      }

      var table = _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_rcTable2.default, _extends({}, restProps, {
          data: data,
          columns: columns,
          className: classString,
          expandIconColumnIndex: columns[0] && columns[0].key === 'selection-column' ? 1 : 0,
          expandIconAsCell: expandIconAsCell
        })),
        emptyText
      );
      // if there is no pagination or no data,
      // the height of spin should decrease by half of pagination
      var paginationPatchClass = this.hasPagination() && data && data.length !== 0 ? 'ant-table-with-pagination' : 'ant-table-without-pagination';
      var spinClassName = this.props.loading ? paginationPatchClass + ' ant-table-spin-holder' : '';
      table = _react2.default.createElement(
        _spin2.default,
        { className: spinClassName, spinning: this.props.loading },
        table
      );
      return _react2.default.createElement(
        'div',
        { className: emptyClass + ' ' + className + ' clearfix', style: style },
        table,
        this.renderPagination()
      );
    }
  }]);

  return Table;
}(_react2.default.Component);

var _initialiseProps = function _initialiseProps() {
  var _this11 = this;

  this.handleFilter = function (column, nextFilters) {
    var props = _this11.props;
    var pagination = _extends({}, _this11.state.pagination);
    var filters = _extends({}, _this11.state.filters, _defineProperty({}, _this11.getColumnKey(column), nextFilters));
    // Remove filters not in current columns
    var currentColumnKeys = props.columns.map(function (c) {
      return _this11.getColumnKey(c);
    });
    Object.keys(filters).forEach(function (columnKey) {
      if (currentColumnKeys.indexOf(columnKey) < 0) {
        delete filters[columnKey];
      }
    });

    if (props.pagination) {
      // Reset current prop
      pagination.current = 1;
      pagination.onChange(pagination.current);
    }

    var newState = {
      selectionDirty: false,
      pagination: pagination
    };
    var filtersToSetState = _extends({}, filters);
    // Remove filters which is controlled
    _this11.getFilteredValueColumns().forEach(function (col) {
      var columnKey = _this11.getColumnKey(col);
      if (columnKey) {
        delete filtersToSetState[columnKey];
      }
    });
    if (Object.keys(filtersToSetState).length > 0) {
      newState.filters = filtersToSetState;
    }

    // Controlled current prop will not respond user interaction
    if (props.pagination && 'current' in props.pagination) {
      newState.pagination = _extends({}, pagination, {
        current: _this11.state.pagination.current
      });
    }

    _this11.setState(newState, function () {
      props.onChange.apply(props, _toConsumableArray(_this11.prepareParamsArguments(_extends({}, _this11.state, {
        selectionDirty: false,
        filters: filters,
        pagination: pagination
      }))));
    });
  };

  this.handleSelect = function (record, rowIndex, e) {
    var checked = e.target.checked;
    var defaultSelection = _this11.state.selectionDirty ? [] : _this11.getDefaultSelection();
    var selectedRowKeys = _this11.state.selectedRowKeys.concat(defaultSelection);
    var key = _this11.getRecordKey(record, rowIndex);
    if (checked) {
      selectedRowKeys.push(_this11.getRecordKey(record, rowIndex));
    } else {
      selectedRowKeys = selectedRowKeys.filter(function (i) {
        return key !== i;
      });
    }
    _this11.setState({
      selectionDirty: true
    });
    _this11.setSelectedRowKeys(selectedRowKeys);
    if (_this11.props.rowSelection.onSelect) {
      var data = _this11.getFlatCurrentPageData();
      var selectedRows = data.filter(function (row, i) {
        return selectedRowKeys.indexOf(_this11.getRecordKey(row, i)) >= 0;
      });
      _this11.props.rowSelection.onSelect(record, checked, selectedRows);
    }
  };

  this.handleRadioSelect = function (record, rowIndex, e) {
    var checked = e.target.checked;
    var defaultSelection = _this11.state.selectionDirty ? [] : _this11.getDefaultSelection();
    var selectedRowKeys = _this11.state.selectedRowKeys.concat(defaultSelection);
    var key = _this11.getRecordKey(record, rowIndex);
    selectedRowKeys = [key];
    _this11.setState({
      selectionDirty: true
    });
    _this11.setSelectedRowKeys(selectedRowKeys);
    if (_this11.props.rowSelection.onSelect) {
      var data = _this11.getFlatCurrentPageData();
      var selectedRows = data.filter(function (row, i) {
        return selectedRowKeys.indexOf(_this11.getRecordKey(row, i)) >= 0;
      });
      _this11.props.rowSelection.onSelect(record, checked, selectedRows);
    }
  };

  this.handleSelectAllRow = function (e) {
    var checked = e.target.checked;
    var data = _this11.getFlatCurrentPageData();
    var defaultSelection = _this11.state.selectionDirty ? [] : _this11.getDefaultSelection();
    var selectedRowKeys = _this11.state.selectedRowKeys.concat(defaultSelection);
    var changableRowKeys = data.filter(function (item) {
      return !_this11.getCheckboxPropsByItem(item).disabled;
    }).map(function (item, i) {
      return _this11.getRecordKey(item, i);
    });

    // 记录变化的列
    var changeRowKeys = [];
    if (checked) {
      changableRowKeys.forEach(function (key) {
        if (selectedRowKeys.indexOf(key) < 0) {
          selectedRowKeys.push(key);
          changeRowKeys.push(key);
        }
      });
    } else {
      changableRowKeys.forEach(function (key) {
        if (selectedRowKeys.indexOf(key) >= 0) {
          selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
          changeRowKeys.push(key);
        }
      });
    }
    _this11.setState({
      selectionDirty: true
    });
    _this11.setSelectedRowKeys(selectedRowKeys);
    if (_this11.props.rowSelection.onSelectAll) {
      var selectedRows = data.filter(function (row, i) {
        return selectedRowKeys.indexOf(_this11.getRecordKey(row, i)) >= 0;
      });
      var changeRows = data.filter(function (row, i) {
        return changeRowKeys.indexOf(_this11.getRecordKey(row, i)) >= 0;
      });
      _this11.props.rowSelection.onSelectAll(checked, selectedRows, changeRows);
    }
  };

  this.handlePageChange = function (current) {
    var _props3;

    var props = _this11.props;
    var pagination = _extends({}, _this11.state.pagination);
    if (current) {
      pagination.current = current;
    } else {
      pagination.current = pagination.current || 1;
    }
    pagination.onChange(pagination.current);

    var newState = {
      selectionDirty: false,
      pagination: pagination
    };
    // Controlled current prop will not respond user interaction
    if (props.pagination && 'current' in props.pagination) {
      newState.pagination = _extends({}, pagination, {
        current: _this11.state.pagination.current
      });
    }
    _this11.setState(newState);

    (_props3 = _this11.props).onChange.apply(_props3, _toConsumableArray(_this11.prepareParamsArguments(_extends({}, _this11.state, {
      selectionDirty: false,
      pagination: pagination
    }))));
  };

  this.renderSelectionRadio = function (value, record, index) {
    var rowIndex = _this11.getRecordKey(record, index); // 从 1 开始
    var props = _this11.getCheckboxPropsByItem(record);
    var checked = void 0;
    if (_this11.state.selectionDirty) {
      checked = _this11.state.selectedRowKeys.indexOf(rowIndex) >= 0;
    } else {
      checked = _this11.state.selectedRowKeys.indexOf(rowIndex) >= 0 || _this11.getDefaultSelection().indexOf(rowIndex) >= 0;
    }
    return _react2.default.createElement(
      'span',
      { onClick: stopPropagation },
      _react2.default.createElement(_radio2.default, { disabled: props.disabled,
        onChange: function onChange(e) {
          return _this11.handleRadioSelect(record, rowIndex, e);
        },
        value: rowIndex, checked: checked
      })
    );
  };

  this.renderSelectionCheckBox = function (value, record, index) {
    var rowIndex = _this11.getRecordKey(record, index); // 从 1 开始
    var checked = void 0;
    if (_this11.state.selectionDirty) {
      checked = _this11.state.selectedRowKeys.indexOf(rowIndex) >= 0;
    } else {
      checked = _this11.state.selectedRowKeys.indexOf(rowIndex) >= 0 || _this11.getDefaultSelection().indexOf(rowIndex) >= 0;
    }
    var props = _this11.getCheckboxPropsByItem(record);
    return _react2.default.createElement(
      'span',
      { onClick: stopPropagation },
      _react2.default.createElement(_checkbox2.default, {
        checked: checked,
        disabled: props.disabled,
        onChange: function onChange(e) {
          return _this11.handleSelect(record, rowIndex, e);
        }
      })
    );
  };

  this.handleShowSizeChange = function (current, pageSize) {
    var _props4;

    var pagination = _this11.state.pagination;
    pagination.onShowSizeChange(current, pageSize);
    var nextPagination = _extends({}, pagination, { pageSize: pageSize, current: current });
    _this11.setState({ pagination: nextPagination });
    (_props4 = _this11.props).onChange.apply(_props4, _toConsumableArray(_this11.prepareParamsArguments(_extends({}, _this11.state, {
      pagination: nextPagination
    }))));
  };
};

exports.default = Table;


Table.propTypes = {
  dataSource: _react2.default.PropTypes.array,
  prefixCls: _react2.default.PropTypes.string,
  useFixedHeader: _react2.default.PropTypes.bool,
  rowSelection: _react2.default.PropTypes.object,
  className: _react2.default.PropTypes.string,
  size: _react2.default.PropTypes.string,
  loading: _react2.default.PropTypes.bool,
  bordered: _react2.default.PropTypes.bool,
  onChange: _react2.default.PropTypes.func,
  locale: _react2.default.PropTypes.object
};

Table.defaultProps = {
  dataSource: [],
  prefixCls: 'ant-table',
  useFixedHeader: false,
  rowSelection: null,
  className: '',
  size: 'large',
  loading: false,
  bordered: false,
  indentSize: 20,
  onChange: noop,
  locale: {}
};

Table.contextTypes = {
  antLocale: _react2.default.PropTypes.object
};