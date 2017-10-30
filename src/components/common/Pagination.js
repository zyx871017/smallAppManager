import React from 'react';
import {FlatButton} from 'material-ui';
import {styles} from './PageStyle';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1
    };
  }

  parsePage = (pages, index) => {
    const res = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) {
        res.push(i);
      }
      return res;
    } else if (index <= 2 || index > pages - 2) {
      return [1, 2, '...', pages - 1, pages];
    } else {
      return [1, '...', index - 1, index, index + 1, '...', pages];
    }

  };

  skipTo = (index) => {
    const that = this;
    this.setState({
      index
    }, () => {
      that.props.pageChange(index);
    });

  };

  render() {
    const {total, limit} = this.props;
    const index = this.state.index;
    const pages = Math.ceil(total / limit);
    const pageButtons = this.parsePage(pages, index);
    return (
      <div style={styles.pageContainer}>
        <FlatButton
          style={styles.button}
          label="<<"
          primary={true}
          onClick={() => {
            this.skipTo(1);
          }}
        />
        <FlatButton
          style={styles.button}
          label="<"
          primary={true}
          onClick={() => {
            this.skipTo(index - 1);
          }}
        />
        {pageButtons.map((item, idx) => {
          if (item === index) {
            return (
              <FlatButton
                style={styles.button}
                label={item}
                key={idx}
                secondary={true}
                onClick={() => {
                  this.skipTo(item);
                }}
              />
            );
          } else if (item !== '...') {
            return (
              <FlatButton
                style={styles.button}
                label={item}
                key={idx}
                onClick={() => {
                  this.skipTo(item);
                }}
                primary={true}
              />
            );
          }
          return (
            <FlatButton
              style={styles.button}
              disabled={true}
              key={idx}
              label={item}
              primary={true}
            />
          );
        })}
        <FlatButton
          style={styles.button}
          label=">"
          primary={true}
          onClick={() => {
            this.skipTo(index + 1);
          }}
        />
        <FlatButton
          style={styles.button}
          label=">>"
          primary={true}
          onClick={() => {
            this.skipTo(pages);
          }}
        />
      </div>
    );
  }
}

export default Pagination;